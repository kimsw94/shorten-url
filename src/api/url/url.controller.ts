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
import { isUrl } from '../url/utils/url-validate.util'
import { NextFunction, Request } from 'express';

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
  ) {}

  @Get('/:newUrl')
  @Redirect('', 302)
  async redirectUrl(@Param('newUrl') newUrl: string) {
    const getUrlInfo = await this.urlService.getUrl(newUrl);
    const redirectUrl = getUrlInfo.url;

    return { url: redirectUrl };
  }

  @Post('shorten')
  @UseGuards(IpLogger, isUrl)
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