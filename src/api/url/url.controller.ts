import {
  Body,
  Param,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { UrlDTO } from './dtos/url.dto';
import { UrlService } from './url.service';
import { IpLogger } from '../../common/utils/ip-logger';
import { NextFunction, Request } from 'express';
import { UrlValidateUtil } from './utils/url-validate.util';

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly urlValidate: UrlValidateUtil,
  ) {}

  @Get('/:newUrl')
  @Redirect('', 302)
  async redirectUrl(@Param('newUrl') newUrl: string) {
    const getUrlInfo = await this.urlService.getUrl(newUrl);
    const redirectUrl = getUrlInfo.url;

    return { url: redirectUrl };
  }

  @Post('shorten')
  @UseGuards(IpLogger)
  async shortenUrl(
    @Body() dto: UrlDTO,
    @Req() req: Request,
    next: NextFunction,
  ) {
    let ip = req.ip;

    const shortenUrl = await this.urlService.shortenUrl(dto, ip);
    return { shortenUrl };
  }
}


// if (dto.url) {
//     const validate = await this.urlValidate.validate(dto, next);
//     return validate;
//   }