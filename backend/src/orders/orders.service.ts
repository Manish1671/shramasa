import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { decimalToString, multiplyMoney } from '../common/utils/money';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyRazorpayPaymentDto } from './dto/verify-razorpay-payment.dto';
import {
  RazorpayCheckoutPayload,
  RazorpayService,
} from './razorpay.service';

type OrderWithRelations = Prisma.OrderGetPayload<{
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
}>;

type CheckoutCart = {
  id: string;
  items: Array<{
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      isActive: boolean;
      stock: number;
      price: Prisma.Decimal;
    };
  }>;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayService: RazorpayService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
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

    if (dto.paymentMethod === PaymentMethod.RAZORPAY) {
      return this.createRazorpayOrder(userId, cart, address.id);
    }

    return this.createCodOrder(cart, address.id, userId);
  }

  private async createCodOrder(
    cart: CheckoutCart,
    addressId: string,
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const { subtotal, orderItemsData } = await this.reserveCartStock(
        tx,
        cart,
      );
      const shipping = new Prisma.Decimal(0);
      const discount = new Prisma.Decimal(0);
      const total = subtotal.add(shipping).sub(discount);

      const order = await tx.order.create({
        data: {
          userId,
          addressId,
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
        include: this.orderInclude,
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return this.formatOrder(order);
    });
  }

  private async createRazorpayOrder(
    userId: string,
    cart: CheckoutCart,
    addressId: string,
  ) {
    const order = await this.prisma.$transaction(async (tx) => {
      const { subtotal, orderItemsData } = await this.reserveCartStock(
        tx,
        cart,
      );
      const shipping = new Prisma.Decimal(0);
      const discount = new Prisma.Decimal(0);
      const total = subtotal.add(shipping).sub(discount);

      const created = await tx.order.create({
        data: {
          userId,
          addressId,
          status: OrderStatus.PENDING,
          paymentMethod: PaymentMethod.RAZORPAY,
          paymentStatus: PaymentStatus.PENDING,
          subtotal,
          shipping,
          discount,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: this.orderInclude,
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return created;
    });

    try {
      const checkout = await this.razorpayService.createCheckoutOrder({
        amountInr: decimalToString(order.total),
        receipt: order.id,
        notes: {
          shramasaOrderId: order.id,
          userId,
        },
      });

      const updated = await this.prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: checkout.orderId },
        include: this.orderInclude,
      });

      return this.formatOrder(updated, checkout);
    } catch (error) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.FAILED,
        },
      });
      throw error;
    }
  }

  async verifyRazorpayPayment(
    userId: string,
    orderId: string,
    dto: VerifyRazorpayPaymentDto,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: this.orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    if (order.paymentMethod !== PaymentMethod.RAZORPAY) {
      throw new BadRequestException('This order is not an online payment order');
    }

    if (
      order.paymentStatus === PaymentStatus.PAID &&
      order.razorpayPaymentId === dto.razorpayPaymentId
    ) {
      return this.formatOrder(order);
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('This order is already paid');
    }

    if (!order.razorpayOrderId) {
      throw new BadRequestException('Online payment was not initialized');
    }

    if (order.razorpayOrderId !== dto.razorpayOrderId) {
      throw new BadRequestException('Razorpay order mismatch');
    }

    this.razorpayService.verifyPaymentSignature({
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.CONFIRMED,
        razorpayPaymentId: dto.razorpayPaymentId,
      },
      include: this.orderInclude,
    });

    return this.formatOrder(updated);
  }

  async markPaidFromWebhook(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
  }) {
    const order = await this.prisma.order.findFirst({
      where: { razorpayOrderId: params.razorpayOrderId },
      include: this.orderInclude,
    });

    if (!order) {
      return null;
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      return this.formatOrder(order);
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.CONFIRMED,
        razorpayPaymentId: params.razorpayPaymentId,
      },
      include: this.orderInclude,
    });

    return this.formatOrder(updated);
  }

  async getCheckoutPayloadForPendingOrder(userId: string, orderId: string) {
    const order = await this.getOwnedOrder(userId, orderId);

    if (
      order.paymentMethod !== PaymentMethod.RAZORPAY ||
      order.paymentStatus !== PaymentStatus.PENDING ||
      !order.razorpayOrderId
    ) {
      throw new BadRequestException('No pending online payment for this order');
    }

    const amountPaise = Math.round(Number(decimalToString(order.total)) * 100);

    return this.formatOrder(order, {
      keyId: this.razorpayService.getPublicKeyId(),
      orderId: order.razorpayOrderId,
      amount: amountPaise,
      currency: 'INR',
    });
  }

  async listForUser(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: this.orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrder(order));
  }

  async getForUser(userId: string, orderId: string) {
    const order = await this.getOwnedOrder(userId, orderId);
    return this.formatOrder(order);
  }

  private async getOwnedOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: this.orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  private async reserveCartStock(
    tx: Prisma.TransactionClient,
    cart: CheckoutCart,
  ) {
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

    return { subtotal, orderItemsData };
  }

  private readonly orderInclude = {
    items: {
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: 'asc' as const },
              take: 1,
            },
          },
        },
      },
    },
    address: true,
  } satisfies Prisma.OrderInclude;

  private formatOrder(
    order: OrderWithRelations,
    razorpay?: RazorpayCheckoutPayload,
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
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
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
      ...(razorpay ? { razorpay } : {}),
    };
  }
}
