import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

const RATE_LIMIT_WINDOW_MS = 2 * 60 * 1000;

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactMessageDto) {
    const recent = await this.prisma.contactMessage.findFirst({
      where: {
        email: dto.email,
        createdAt: {
          gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS),
        },
      },
      select: { id: true },
    });

    if (recent) {
      throw new HttpException(
        'Please wait a moment before sending another message.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
    });

    return { success: true as const };
  }
}
