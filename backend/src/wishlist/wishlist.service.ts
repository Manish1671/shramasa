import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { decimalToString } from '../common/utils/money';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';

const wishlistItemInclude = {
  product: {
    include: {
      images: {
        orderBy: { sortOrder: 'asc' as const },
        take: 1,
      },
      category: true,
    },
  },
} satisfies Prisma.WishlistItemInclude;

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const wishlist = await this.ensureWishlist(userId);
    return this.formatWishlist(wishlist.id);
  }

  async addItem(userId: string, dto: AddWishlistItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    const wishlist = await this.ensureWishlist(userId);

    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: product.id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Product is already in your wishlist');
    }

    await this.prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: product.id,
      },
    });

    return this.formatWishlist(wishlist.id);
  }

  async removeItem(userId: string, productId: string) {
    const wishlist = await this.ensureWishlist(userId);
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: item.id },
    });

    return this.formatWishlist(wishlist.id);
  }

  async hasProduct(userId: string, productId: string): Promise<boolean> {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!wishlist) {
      return false;
    }

    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
      select: { id: true },
    });

    return Boolean(item);
  }

  private async ensureWishlist(userId: string) {
    return this.prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  private async formatWishlist(wishlistId: string) {
    const wishlist = await this.prisma.wishlist.findUniqueOrThrow({
      where: { id: wishlistId },
      include: {
        items: {
          include: wishlistItemInclude,
          orderBy: { id: 'desc' },
        },
      },
    });

    return {
      id: wishlist.id,
      itemCount: wishlist.items.length,
      items: wishlist.items.map((item) => ({
        id: item.id,
        productId: item.productId,
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
      })),
    };
  }
}
