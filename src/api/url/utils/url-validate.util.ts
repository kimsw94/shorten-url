import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { NestMiddleware } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { UrlDTO } from '../dtos/url.dto';

@Injectable()
export class isUrl implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#]+\.(com|co\.kr|net)(\/[^\s]*)?$/;

    if (urlRegex.test(req.body.url)) {
      next();
    } else {
      throw new InternalServerErrorException('유효한 URL 형태가 아닙니다.');
    }
  }
}

// @Injectable()
// export class UrlValidateUtil {

//   async validate(dto: UrlDTO, next: NextFunction) {
    
//         try {
//             const url = new URL(dto.url);
//             next()
//         } catch (error) {
//             throw new InternalServerErrorException("유효한 URL 형태가 아닙니다.")
//         }

//     }
// }
