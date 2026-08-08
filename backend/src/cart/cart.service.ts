import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { decimalToString, multiplyMoney } from '../common/utils/money';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

const cartItemInclude = {
  product: {
    include: {
      images: {
        orderBy: { sortOrder: 'asc' as const },
        take: 1,
      },
      category: true,
    },
  },
} satisfies Prisma.CartItemInclude;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.ensureCart(userId);
    return this.formatCart(cart.id);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const product = await this.getActiveProduct(dto.productId);
    const cart = await this.ensureCart(userId);

    const existing = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
    });

    const nextQuantity = (existing?.quantity ?? 0) + dto.quantity;
    this.assertStock(product.stock, nextQuantity, product.name);

    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: nextQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: dto.quantity,
        },
      });
    }

    return this.formatCart(cart.id);
  }

  async updateItem(userId: string, productId: string, dto: UpdateCartItemDto) {
    const cart = await this.ensureCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (!item.product.isActive) {
      throw new BadRequestException(
        `${item.product.name} is no longer available`,
      );
    }

    this.assertStock(item.product.stock, dto.quantity, item.product.name);

    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });

    return this.formatCart(cart.id);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.ensureCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: item.id },
    });

    return this.formatCart(cart.id);
  }

  async clearCart(userId: string) {
    const cart = await this.ensureCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.formatCart(cart.id);
  }

  private async ensureCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  private async getActiveProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock <= 0) {
      throw new BadRequestException(`${product.name} is out of stock`);
    }

    return product;
  }

  private assertStock(stock: number, quantity: number, productName: string) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    if (quantity > stock) {
      throw new BadRequestException(
        `Only ${stock} unit(s) of ${productName} available`,
      );
    }
  }

  private async formatCart(cartId: string) {
    const cart = await this.prisma.cart.findUniqueOrThrow({
      where: { id: cartId },
      include: {
        items: {
          include: cartItemInclude,
          orderBy: { id: 'asc' },
        },
      },
    });

    const items = cart.items.map((item) => {
      const lineTotal = multiplyMoney(item.product.price, item.quantity);

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        lineTotal: decimalToString(lineTotal),
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          description: item.product.description,
          price: decimalToString(item.product.price),
          compareAtPrice: item.product.compareAtPrice
            ? decimalToString(item.product.compareAtPrice)
            : null,
          stock: item.product.stock,
          isActive: item.product.isActive,
          category: item.product.category,
          images: item.product.images,
        },
      };
    });

    const subtotal = items.reduce(
      (sum, item) => sum.add(item.lineTotal),
      new Prisma.Decimal(0),
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      items,
      itemCount,
      subtotal: decimalToString(subtotal),
      shipping: decimalToString(new Prisma.Decimal(0)),
      discount: decimalToString(new Prisma.Decimal(0)),
      total: decimalToString(subtotal),
    };
  }
}
