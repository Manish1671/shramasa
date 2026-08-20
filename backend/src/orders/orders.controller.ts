import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { SafeUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyRazorpayPaymentDto } from './dto/verify-razorpay-payment.dto';
import { OrdersService } from './orders.service';
import { RazorpayService } from './razorpay.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly razorpayService: RazorpayService,
  ) {}

  @Post('webhooks/razorpay')
  async razorpayWebhook(
    @Req() req: { rawBody?: Buffer },
    @Headers('x-razorpay-signature') signature: string | undefined,
    @Body()
    body: {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            status?: string;
          };
        };
      };
    },
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      return { received: false };
    }

    this.razorpayService.verifyWebhookSignature(rawBody, signature);

    const event = body.event;
    const payment = body.payload?.payment?.entity;

    if (
      (event === 'payment.captured' || event === 'order.paid') &&
      payment?.order_id &&
      payment?.id &&
      (payment.status === 'captured' || !payment.status)
    ) {
      await this.ordersService.markPaidFromWebhook({
        razorpayOrderId: payment.order_id,
        razorpayPaymentId: payment.id,
      });
    }

    return { received: true };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: SafeUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@CurrentUser() user: SafeUser) {
    return this.ordersService.listForUser(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOne(@CurrentUser() user: SafeUser, @Param('id') id: string) {
    return this.ordersService.getForUser(user.id, id);
  }

  @Get(':id/razorpay-checkout')
  @UseGuards(JwtAuthGuard)
  getRazorpayCheckout(
    @CurrentUser() user: SafeUser,
    @Param('id') id: string,
  ) {
    return this.ordersService.getCheckoutPayloadForPendingOrder(user.id, id);
  }

  @Post(':id/verify-payment')
  @UseGuards(JwtAuthGuard)
  verifyPayment(
    @CurrentUser() user: SafeUser,
    @Param('id') id: string,
    @Body() dto: VerifyRazorpayPaymentDto,
  ) {
    return this.ordersService.verifyRazorpayPayment(user.id, id, dto);
  }
}
