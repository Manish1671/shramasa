import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  Prisma,
  type Product,
} from '../../generated/prisma/client';
import { decimalToString } from '../common/utils/money';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productInclude = {
  category: true,
  images: {
    orderBy: { sortOrder: 'asc' as const },
  },
} satisfies Prisma.ProductInclude;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      revenueAggregate,
      unreadContactMessages,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count(),
      this.prisma.order.count({
        where: {
          status: {
            in: [
              OrderStatus.PENDING,
              OrderStatus.CONFIRMED,
              OrderStatus.PROCESSING,
            ],
          },
        },
      }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: { not: OrderStatus.CANCELLED },
        },
      }),
      this.prisma.contactMessage.count({
        where: { readAt: null },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      unreadContactMessages,
      totalRevenue: decimalToString(
        revenueAggregate._sum.total ?? new Prisma.Decimal(0),
      ),
    };
  }

  listCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async listProducts(query: {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
  }) {
    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const products = await this.prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { updatedAt: 'desc' },
    });

    return products.map((product) => this.formatProduct(product));
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  async createProduct(dto: CreateProductDto) {
    await this.assertCategoryExists(dto.categoryId);
    await this.assertSlugAvailable(dto.slug);
    this.assertPriceRules(dto.price, dto.compareAtPrice);

    const product = await this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        slug: dto.slug.trim(),
        description: dto.description.trim(),
        ingredients: dto.ingredients?.trim() || null,
        howToUse: dto.howToUse?.trim() || null,
        price: new Prisma.Decimal(dto.price),
        compareAtPrice:
          dto.compareAtPrice !== undefined
            ? new Prisma.Decimal(dto.compareAtPrice)
            : null,
        stock: Math.floor(dto.stock),
        categoryId: dto.categoryId,
        isActive: dto.isActive ?? true,
        images: dto.images?.length
          ? {
              create: dto.images.map((image, index) => ({
                url: image.url,
                altText: image.altText?.trim() || null,
                sortOrder: image.sortOrder ?? index,
              })),
            }
          : undefined,
      },
      include: productInclude,
    });

    return this.formatProduct(product);
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    if (dto.categoryId) {
      await this.assertCategoryExists(dto.categoryId);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.assertSlugAvailable(dto.slug);
    }

    const nextPrice = dto.price ?? Number(existing.price);
    const nextCompare =
      dto.compareAtPrice === null
        ? undefined
        : (dto.compareAtPrice ??
          (existing.compareAtPrice
            ? Number(existing.compareAtPrice)
            : undefined));
    this.assertPriceRules(nextPrice, nextCompare);

    const product = await this.prisma.$transaction(async (tx) => {
      if (dto.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
      }

      return tx.product.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.slug !== undefined ? { slug: dto.slug.trim() } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description.trim() }
            : {}),
          ...(dto.ingredients !== undefined
            ? { ingredients: dto.ingredients?.trim() || null }
            : {}),
          ...(dto.howToUse !== undefined
            ? { howToUse: dto.howToUse?.trim() || null }
            : {}),
          ...(dto.price !== undefined
            ? { price: new Prisma.Decimal(dto.price) }
            : {}),
          ...(dto.compareAtPrice !== undefined
            ? {
                compareAtPrice:
                  dto.compareAtPrice === null
                    ? null
                    : new Prisma.Decimal(dto.compareAtPrice),
              }
            : {}),
          ...(dto.stock !== undefined
            ? { stock: Math.floor(dto.stock) }
            : {}),
          ...(dto.categoryId !== undefined
            ? { categoryId: dto.categoryId }
            : {}),
          ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
          ...(dto.images
            ? {
                images: {
                  create: dto.images.map((image, index) => ({
                    url: image.url,
                    altText: image.altText?.trim() || null,
                    sortOrder: image.sortOrder ?? index,
                  })),
                },
              }
            : {}),
        },
        include: productInclude,
      });
    });

    return this.formatProduct(product);
  }

  async setProductActive(id: string, isActive: boolean) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: { isActive },
      include: productInclude,
    });

    return this.formatProduct(product);
  }

  async deleteProduct(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const orderItemCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemCount > 0) {
      throw new BadRequestException(
        'This product appears in existing orders and cannot be deleted. Deactivate it instead.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { productId: id } });
      await tx.wishlistItem.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });

    return { success: true };
  }

  async listOrders(status?: OrderStatus) {
    const orders = await this.prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        address: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatAdminOrder(order));
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        address: true,
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

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatAdminOrder(order);
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    if (
      existing.status === OrderStatus.CANCELLED &&
      status !== OrderStatus.CANCELLED
    ) {
      throw new BadRequestException('Cancelled orders cannot be reopened');
    }

    if (
      existing.status === OrderStatus.DELIVERED &&
      status !== OrderStatus.DELIVERED
    ) {
      throw new BadRequestException('Delivered orders cannot change status');
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        address: true,
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

    return this.formatAdminOrder(order);
  }

  listContactMessages() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async markContactMessageRead(id: string) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Message not found');
    }

    if (existing.readAt) {
      return existing;
    }

    return this.prisma.contactMessage.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  private async assertCategoryExists(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
  }

  private async assertSlugAvailable(slug: string) {
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException('A product with this slug already exists');
    }
  }

  private assertPriceRules(price: number, compareAtPrice?: number) {
    if (price <= 0) {
      throw new BadRequestException('Price must be greater than zero');
    }
    if (compareAtPrice !== undefined && compareAtPrice < price) {
      throw new BadRequestException(
        'Compare-at price must be greater than or equal to price',
      );
    }
  }

  private formatProduct(
    product: Product & {
      category: { id: string; name: string; slug: string };
      images: Array<{
        id: string;
        url: string;
        altText: string | null;
        sortOrder: number;
      }>;
    },
  ) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      ingredients: product.ingredients,
      howToUse: product.howToUse,
      price: decimalToString(product.price),
      compareAtPrice: product.compareAtPrice
        ? decimalToString(product.compareAtPrice)
        : null,
      stock: product.stock,
      isActive: product.isActive,
      categoryId: product.categoryId,
      category: product.category,
      images: product.images,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private formatAdminOrder(
    order: Prisma.OrderGetPayload<{
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            phone: true;
          };
        };
        address: true;
        items: {
          include: {
            product: {
              include: {
                images: true;
              };
            };
          };
        };
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
      user: order.user,
      address: order.address,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: decimalToString(item.price),
        quantity: item.quantity,
        lineTotal: decimalToString(item.price.mul(item.quantity)),
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
