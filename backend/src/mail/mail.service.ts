import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string | null;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST')?.trim();
    const from = this.configService.get<string>('SMTP_FROM')?.trim();

    if (!host || !from) {
      this.transporter = null;
      this.from = null;
      return;
    }

    const parsedPort = Number.parseInt(
      this.configService.get<string>('SMTP_PORT') ?? '587',
      10,
    );
    const port = Number.isSafeInteger(parsedPort) ? parsedPort : 587;
    const user = this.configService.get<string>('SMTP_USER')?.trim();
    const pass = this.configService.get<string>('SMTP_PASSWORD');

    this.from = from;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user ? { user, pass: pass ?? '' } : undefined,
    });
  }

  isConfigured(): boolean {
    return this.transporter !== null && this.from !== null;
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    if (!this.transporter || !this.from) {
      throw new Error('SMTP is not configured');
    }

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Reset your Shramasa password',
      text: [
        'Use this link to choose a new password. It expires in one hour.',
        '',
        resetUrl,
        '',
        'If you did not ask for this, you can ignore this email.',
      ].join('\n'),
    });
  }

  logPasswordResetLink(resetUrl: string): void {
    this.logger.log(`Password reset link (development): ${resetUrl}`);
  }
}
