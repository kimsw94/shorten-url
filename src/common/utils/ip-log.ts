import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpLog implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['clientIp'] = req.ip;
  }
}
