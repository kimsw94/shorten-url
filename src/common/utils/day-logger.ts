import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class isToday implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let today = startOfDay(new Date()).toISOString();
    let tomorrow = endOfDay(new Date()).toISOString();
    next()
  }
}