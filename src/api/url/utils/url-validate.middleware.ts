import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { NestMiddleware } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class isUrl implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.[^\s]{2,}(\/|$)/;

    if (urlRegex.test(req.body.url)) {
      next();
    } else {
      throw new InternalServerErrorException('유효한 URL 형태가 아닙니다.');
    }
  }
}

export class AppModule { }