import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { decimalToString, multiplyMoney } from '../common/utils/money';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    if (dto.paymentMethod === PaymentMethod.RAZORPAY) {
      const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
      const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

      if (!keyId || !keySecret) {
        throw new ServiceUnavailableException(
          'Online payment is not configured. Please use Cash on Delivery.',
        );
      }

      // Razorpay order creation will be wired here once credentials are available.
      throw new ServiceUnavailableException(
        'Razorpay checkout is not enabled yet. Please use Cash on Delivery.',
      );
    }

    const address = await this.prisma.address.findUnique({
      where: { id: dto.addressId },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('You do not have access to this address');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    return this.prisma.$transaction(async (tx) => {
      let subtotal = new Prisma.Decimal(0);
      const orderItemsData: Array<{
        productId: string;
        productName: string;
        price: Prisma.Decimal;
        quantity: number;
      }> = [];

      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          throw new BadRequestException(
            `${item.product.name} is no longer available`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Only ${product.stock} unit(s) of ${product.name} available`,
          );
        }

        if (item.quantity <= 0) {
          throw new BadRequestException('Invalid cart quantity');
        }

        const lineTotal = multiplyMoney(product.price, item.quantity);
        subtotal = subtotal.add(lineTotal);

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
        });

        const updated = await tx.product.updateMany({
          where: {
            id: product.id,
            stock: { gte: item.quantity },
            isActive: true,
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (updated.count !== 1) {
          throw new BadRequestException(
            `Unable to reserve stock for ${product.name}`,
          );
        }
      }

      const shipping = new Prisma.Decimal(0);
      const discount = new Prisma.Decimal(0);
      const total = subtotal.add(shipping).sub(discount);

      const order = await tx.order.create({
        data: {
          userId,
          addressId: address.id,
          status: OrderStatus.CONFIRMED,
          paymentMethod: PaymentMethod.COD,
          paymentStatus: PaymentStatus.PENDING,
          subtotal,
          shipping,
          discount,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { sortOrder: 'asc' },
                    take: 1,
                  },
                },
              },
            },
          },
          address: true,
        },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return this.formatOrder(order);
    });
  }

  async listForUser(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrder(order));
  }

  async getForUser(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return this.formatOrder(order);
  }

  private formatOrder(
    order: Prisma.OrderGetPayload<{
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true;
              };
            };
          };
        };
        address: true;
      };
    }>,
  ) {
    return {
      id: order.id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: decimalToString(order.subtotal),
      shipping: decimalToString(order.shipping),
      discount: decimalToString(order.discount),
      total: decimalToString(order.total),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      address: order.address,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: decimalToString(item.price),
        quantity: item.quantity,
        lineTotal: decimalToString(multiplyMoney(item.price, item.quantity)),
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          images: item.product.images,
        },
      })),
    };
  }
}
