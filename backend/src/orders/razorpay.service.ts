import { createHmac, timingSafeEqual } from 'crypto';
import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

export type RazorpayCheckoutPayload = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
};

@Injectable()
export class RazorpayService {
  constructor(private readonly configService: ConfigService) {}

  private getCredentials() {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID')?.trim();
    const keySecret = this.configService
      .get<string>('RAZORPAY_KEY_SECRET')
      ?.trim();

    if (!keyId || !keySecret) {
      throw new ServiceUnavailableException(
        'Online payment is not configured. Please use Cash on Delivery.',
      );
    }

    if (
      process.env.NODE_ENV === 'production' &&
      keyId.startsWith('rzp_test_')
    ) {
      throw new ServiceUnavailableException(
        'Online payment is not configured. Please use Cash on Delivery.',
      );
    }

    return { keyId, keySecret };
  }

  private getClient() {
    const { keyId, keySecret } = this.getCredentials();
    return {
      keyId,
      client: new Razorpay({ key_id: keyId, key_secret: keySecret }),
    };
  }

  /** Amount must already be the authoritative server-side order total in INR. */
  async createCheckoutOrder(params: {
    amountInr: string | number;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<RazorpayCheckoutPayload> {
    const { keyId, client } = this.getClient();
    const amountPaise = Math.round(Number(params.amountInr) * 100);

    if (!Number.isFinite(amountPaise) || amountPaise < 100) {
      throw new BadRequestException('Order total is too low for online payment');
    }

    const razorpayOrder = await client.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: params.receipt.slice(0, 40),
      notes: params.notes,
    });

    if (!razorpayOrder.id) {
      throw new ServiceUnavailableException(
        'Unable to start online payment. Please try again.',
      );
    }

    return {
      keyId,
      orderId: razorpayOrder.id,
      amount: amountPaise,
      currency: 'INR',
    };
  }

  verifyPaymentSignature(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const { keySecret } = this.getCredentials();
    const expected = createHmac('sha256', keySecret)
      .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expected, 'utf8');
    const actualBuffer = Buffer.from(params.razorpaySignature, 'utf8');

    if (
      expectedBuffer.length !== actualBuffer.length ||
      !timingSafeEqual(expectedBuffer, actualBuffer)
    ) {
      throw new BadRequestException('Payment signature verification failed');
    }
  }

  verifyWebhookSignature(rawBody: Buffer, signature: string | undefined) {
    const webhookSecret = this.configService
      .get<string>('RAZORPAY_WEBHOOK_SECRET')
      ?.trim();

    if (!webhookSecret) {
      throw new ServiceUnavailableException('Webhook secret is not configured');
    }

    if (!signature) {
      throw new BadRequestException('Missing webhook signature');
    }

    const expected = createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expected, 'utf8');
    const actualBuffer = Buffer.from(signature, 'utf8');

    if (
      expectedBuffer.length !== actualBuffer.length ||
      !timingSafeEqual(expectedBuffer, actualBuffer)
    ) {
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  getPublicKeyId() {
    return this.getCredentials().keyId;
  }
}
