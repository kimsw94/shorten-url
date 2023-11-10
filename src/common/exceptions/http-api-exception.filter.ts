import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { omit } from 'lodash';

@Catch(HttpException)
export class HttpApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpApiExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | {
          error: string;
          statusCode: number;
          message: string[];
          error_message: string;
          error_code: string;
        };
    this.logger.error(error);

    if (typeof error === 'string') {
      response
        .status(status)
        .json({ success: false, statusCode: status, message: error });
    } else {
      response
        .status(status)
        .json({ success: false, ...omit(error, 'error_message') });
    }
  }
}
