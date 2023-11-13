import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exception.filter';
import { UrlDTO } from '../dtos/url.dto';
import { NextFunction } from 'express';


@Injectable()
export class UrlValidateUtil {

  async validate(dto: UrlDTO, next: NextFunction) {
    
        try {
            const url = new URL(dto.url);
            next()
        } catch (error) {
            throw new InternalServerErrorException("유효한 URL 형태가 아닙니다.")
        }

    }
}
