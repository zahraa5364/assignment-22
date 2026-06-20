import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/config.service';
import { IJwtPayload, IPurposeTokenPayload } from './token.interface';


@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: AppConfigService,
  ) {}

  signAccessToken(payload: IJwtPayload): string {
    const { accessSecret, accessExpiresIn } = this.configService.jwt;
    return this.nestJwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn,
    });
  }

  verifyAccessToken(token: string): IJwtPayload {
    const { accessSecret } = this.configService.jwt;
    return this.nestJwtService.verify<IJwtPayload>(token, { secret: accessSecret });
  }

  signRefreshToken(payload: IJwtPayload): string {
    const { refreshSecret, refreshExpiresIn } = this.configService.jwt;
    return this.nestJwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });
  }

  verifyRefreshToken(token: string): IJwtPayload {
    const { refreshSecret } = this.configService.jwt;
    return this.nestJwtService.verify<IJwtPayload>(token, { secret: refreshSecret });
  }

  signConfirmEmailToken(payload: IPurposeTokenPayload): string {
    const { confirmEmailSecret, confirmEmailExpiresIn } = this.configService.jwt;
    return this.nestJwtService.sign(payload, {
      secret: confirmEmailSecret,
      expiresIn: confirmEmailExpiresIn,
    });
  }

  verifyConfirmEmailToken(token: string): IPurposeTokenPayload {
    const { confirmEmailSecret } = this.configService.jwt;
    return this.nestJwtService.verify<IPurposeTokenPayload>(token, {
      secret: confirmEmailSecret,
    });
  }

  signResetPasswordToken(payload: IPurposeTokenPayload): string {
    const { resetPasswordSecret, resetPasswordExpiresIn } = this.configService.jwt;
    return this.nestJwtService.sign(payload, {
      secret: resetPasswordSecret,
      expiresIn: resetPasswordExpiresIn,
    });
  }

  verifyResetPasswordToken(token: string): IPurposeTokenPayload {
    const { resetPasswordSecret } = this.configService.jwt;
    return this.nestJwtService.verify<IPurposeTokenPayload>(token, {
      secret: resetPasswordSecret,
    });
  }

  
  static expiresInToSeconds(expiresIn: string): number {
    const match = /^(\d+)([smhd])$/.exec(expiresIn);
    if (!match) {
      
      const asNumber = Number(expiresIn);
      return Number.isNaN(asNumber) ? 3600 : asNumber;
    }
    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    return value * multipliers[unit];
  }
}
