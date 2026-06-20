import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';


@Injectable()
export class AppConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') as string;
  }

  get port(): number {
    return Number(this.configService.get<string>('PORT'));
  }

  get dbUri(): string {
    return this.configService.get<string>('DB_URI') as string;
  }

  get jwt() {
    return {
      accessSecret: this.configService.get<string>('JWT_ACCESS_SECRET') as string,
      accessExpiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') as string,
      refreshSecret: this.configService.get<string>('JWT_REFRESH_SECRET') as string,
      refreshExpiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as string,
      confirmEmailSecret: this.configService.get<string>('JWT_CONFIRM_EMAIL_SECRET') as string,
      confirmEmailExpiresIn: this.configService.get<string>(
        'JWT_CONFIRM_EMAIL_EXPIRES_IN',
      ) as string,
      resetPasswordSecret: this.configService.get<string>('JWT_RESET_PASSWORD_SECRET') as string,
      resetPasswordExpiresIn: this.configService.get<string>(
        'JWT_RESET_PASSWORD_EXPIRES_IN',
      ) as string,
    };
  }

  get saltRounds(): number {
    return Number(this.configService.get<string>('SALT_ROUNDS'));
  }

  get redis() {
    return {
      host: this.configService.get<string>('REDIS_HOST') as string,
      port: Number(this.configService.get<string>('REDIS_PORT')),
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
    };
  }

  get email() {
    return {
      host: this.configService.get<string>('EMAIL_HOST') as string,
      port: Number(this.configService.get<string>('EMAIL_PORT')),
      user: this.configService.get<string>('EMAIL_USER') as string,
      password: this.configService.get<string>('EMAIL_PASSWORD') as string,
      from: this.configService.get<string>('EMAIL_FROM') as string,
    };
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL') as string;
  }
}
