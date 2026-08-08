import { Prisma } from '../../../generated/prisma/client';

export function toDecimal(value: Prisma.Decimal | string | number): Prisma.Decimal {
  return new Prisma.Decimal(value);
}

export function decimalToString(value: Prisma.Decimal): string {
  return value.toFixed(2);
}

export function multiplyMoney(
  price: Prisma.Decimal,
  quantity: number,
): Prisma.Decimal {
  return price.mul(quantity);
}
