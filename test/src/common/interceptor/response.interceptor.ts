import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IApiResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}


@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((result) => {
        
        const message =
          result && typeof result === 'object' && 'message' in result
            ? (result as { message: string }).message
            : 'Success';

        const data =
          result && typeof result === 'object' && 'data' in result
            ? (result as { data: T }).data
            : result;

        return {
          success: true,
          statusCode,
          message,
          data,
        };
      }),
    );
  }
}
