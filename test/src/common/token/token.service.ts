import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { RedisService } from '../redis/redis.service';
import { JwtService } from './jwt.service';
import { IJwtPayload, ITokenPair } from './token.interface';

const refreshTokenRedisKey = (userId: string) => `refresh-token:${userId}`;


@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: AppConfigService,
  ) {}

  async generateTokenPair(payload: IJwtPayload): Promise<ITokenPair> {
    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);

    const { refreshExpiresIn } = this.configService.jwt;
    const ttlSeconds = JwtService.expiresInToSeconds(refreshExpiresIn);

    await this.redisService.set(refreshTokenRedisKey(payload.sub), refreshToken, ttlSeconds);

    return { accessToken, refreshToken };
  }

  
  async refreshAccessToken(refreshToken: string): Promise<ITokenPair> {
    let payload: IJwtPayload;

    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const storedToken = await this.redisService.get(refreshTokenRedisKey(payload.sub));

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token has been revoked or reused');
    }

    
    return this.generateTokenPair({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.redisService.del(refreshTokenRedisKey(userId));
  }
}
