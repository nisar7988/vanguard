import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface API_Response<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  API_Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<API_Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data?.success !== undefined) return data;

        // Detect paginated response
        if (
          data &&
          typeof data === 'object' &&
          'items' in data &&
          'meta' in data
        ) {
          return {
            success: true,
            message: 'Request successful',
            data: data.items,
            ...data.meta, // page, pageSize, totalCount, etc.
          };
        }

        return {
          success: true,
          message: 'Request successful',
          data,
        };
      }),
    );
  }
}
