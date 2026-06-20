import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { TokenService } from './token.service';


@Global()
@Module({
  imports: [NestJwtModule.register({})],
  providers: [JwtService, TokenService],
  exports: [JwtService, TokenService],
})
export class TokenModule {}
