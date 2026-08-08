import type { Prisma, UserRole } from '../../generated/prisma/client';

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};
