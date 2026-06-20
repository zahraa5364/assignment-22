import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { EmailModule } from './common/utils/email/email.module';
import { RedisModule } from './common/redis/redis.module';
import { TokenModule } from './common/token/token.module';
import { DBModule } from './DB/db.module';
import { UserModule } from './modules/user/user.module';

import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';


@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        uri: configService.dbUri,
      }),
    }),
    EmailModule,
    RedisModule,
    TokenModule,
    DBModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
