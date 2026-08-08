import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethod } from '../../../generated/prisma/client';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
