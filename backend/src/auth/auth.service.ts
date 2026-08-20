import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  AuthResponse,
  JwtPayload,
  SafeUser,
  safeUserSelect,
} from './auth.types';

const passwordSaltRounds = 12;
const resetTokenTtlMs = 60 * 60 * 1000;
const resetRequestCooldownMs = 2 * 60 * 1000;

function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    this.googleClient = new OAuth2Client();
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, passwordSaltRounds);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name.trim(),
          email,
          phone: dto.phone.replace(/[\s-]/g, ''),
          passwordHash,
        },
        select: safeUserSelect,
      });

      return this.createAuthResponse(user);
    } catch (error: unknown) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }

      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please continue with Google.',
      );
    }

    if (!(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return this.createAuthResponse(safeUser);
  }

  async googleLogin(dto: GoogleAuthDto): Promise<AuthResponse> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID')?.trim();

    if (!clientId) {
      throw new ServiceUnavailableException(
        'Google Sign-In is not configured.',
      );
    }

    let payload: {
      sub?: string;
      email?: string;
      email_verified?: boolean | string;
      name?: string;
      iss?: string;
    };

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: clientId,
      });
      payload = ticket.getPayload() ?? {};
    } catch {
      throw new UnauthorizedException('Google Sign-In failed. Please try again.');
    }

    const googleSub = payload.sub?.trim();
    const email = payload.email?.trim().toLowerCase();
    const emailVerified =
      payload.email_verified === true || payload.email_verified === 'true';
    const issuer = payload.iss;

    if (
      !googleSub ||
      !email ||
      !emailVerified ||
      (issuer !== 'accounts.google.com' &&
        issuer !== 'https://accounts.google.com')
    ) {
      throw new UnauthorizedException('Google Sign-In failed. Please try again.');
    }

    const existingByGoogle = await this.prisma.user.findUnique({
      where: { googleSub },
      select: safeUserSelect,
    });

    if (existingByGoogle) {
      return this.createAuthResponse(existingByGoogle);
    }

    const existingByEmail = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        googleSub: true,
        passwordHash: true,
      },
    });

    if (existingByEmail) {
      throw new ConflictException(
        'An account with this email already exists. Please sign in with email and password.',
      );
    }

    const nameFromGoogle = payload.name?.trim();
    const fallbackName = email.split('@')[0] || 'Shramasa Customer';

    try {
      const user = await this.prisma.user.create({
        data: {
          googleSub,
          email,
          name: nameFromGoogle && nameFromGoogle.length > 0 ? nameFromGoogle : fallbackName,
          passwordHash: null,
          phone: null,
          role: 'CUSTOMER',
        },
        select: safeUserSelect,
      });

      return this.createAuthResponse(user);
    } catch (error: unknown) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          'An account with this email already exists. Please sign in with email and password.',
        );
      }

      throw error;
    }
  }

  getPasswordResetStatus() {
    return {
      emailDelivery: this.isPasswordResetAvailable(),
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ success: true }> {
    if (!this.isPasswordResetAvailable()) {
      throw new ServiceUnavailableException(
        'Password reset by email is not available yet. Please use the contact form.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user?.passwordHash) {
      return { success: true };
    }

    const recent = await this.prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        usedAt: null,
        createdAt: {
          gte: new Date(Date.now() - resetRequestCooldownMs),
        },
      },
      select: { id: true },
    });

    if (recent) {
      return { success: true };
    }

    const rawToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + resetTokenTtlMs);

    await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
      }),
      this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashResetToken(rawToken),
          expiresAt,
        },
      }),
    ]);

    const frontendUrl = (
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000'
    ).replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    if (this.mailService.isConfigured()) {
      try {
        await this.mailService.sendPasswordReset(user.email, resetUrl);
      } catch {
        this.logger.error('Failed to send password reset email');
        await this.prisma.passwordResetToken.deleteMany({
          where: {
            userId: user.id,
            usedAt: null,
          },
        });
        throw new ServiceUnavailableException(
          'Unable to send a reset email right now. Please try again or use the contact form.',
        );
      }
    } else {
      this.mailService.logPasswordResetLink(resetUrl);
    }

    return { success: true };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ success: true }> {
    const tokenHash = hashResetToken(dto.token.toLowerCase());
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        usedAt: true,
        expiresAt: true,
        user: {
          select: {
            passwordHash: true,
          },
        },
      },
    });

    if (
      !record ||
      record.usedAt ||
      !record.user.passwordHash ||
      record.expiresAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException(
        'This reset link is invalid or has expired.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, passwordSaltRounds);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.passwordResetToken.deleteMany({
        where: {
          userId: record.userId,
          id: { not: record.id },
        },
      }),
    ]);

    return { success: true };
  }

  private isPasswordResetAvailable(): boolean {
    if (this.mailService.isConfigured()) {
      return true;
    }

    return this.configService.get<string>('NODE_ENV') !== 'production';
  }

  private async createAuthResponse(user: SafeUser): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
