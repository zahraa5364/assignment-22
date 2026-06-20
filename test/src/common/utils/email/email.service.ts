import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { generateEmailTemplate } from './templates/email.template';

export interface ISendEmailOptions {
  to: string;
  subject: string;
  greetingName?: string;
  message: string;
  actionUrl: string;
  actionLabel: string;
}


@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.fromAddress = this.configService.get<string>('EMAIL_FROM') as string;

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: Number(this.configService.get<string>('EMAIL_PORT')),
      secure: false, // true for port 465, false for other ports (e.g. 587 STARTTLS)
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  
  async sendEmail(options: ISendEmailOptions): Promise<void> {
    const { to, subject, greetingName, message, actionUrl, actionLabel } = options;

    const html = generateEmailTemplate({
      title: subject,
      greetingName,
      message,
      actionUrl,
      actionLabel,
    });

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to} - subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error as Error);
      throw error;
    }
  }
}
