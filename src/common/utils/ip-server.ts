import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpServer {
//   use(req: Request, res: Response, next: NextFunction) {
//     req['serverIp'] = req.connection.localAddress;
//     next();
//   }
}
