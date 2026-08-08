import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { SafeUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser() user: SafeUser) {
    return this.wishlistService.getWishlist(user.id);
  }

  @Post('items')
  addItem(@CurrentUser() user: SafeUser, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.addItem(user.id, dto);
  }

  @Delete('items/:productId')
  removeItem(
    @CurrentUser() user: SafeUser,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItem(user.id, productId);
  }
}
