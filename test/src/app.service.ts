import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; status: string; timestamp: string } {
    return {
      message: 'NestJS + Mongoose assignment API is up and running 🚀',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
