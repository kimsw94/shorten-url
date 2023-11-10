import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AsyncWrapMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        await next(); // 비동기 미들웨어 실행
      } catch (error) {
        // 에러 핸들링
        console.error('에러 발생:', error);
        // 에러 응답 또는 다른 처리 동작 수행
      }
    })();
  }
}
