import {
  Controller,
  Get,
  Redirect,
  Param,
  Res,
  Req,
  Body,
  Post,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { IpLogger } from './common/utils/ip-logger';
import { UrlDTO } from './dtos/app.dto';
import { UrlValidate } from './common/utils/url-validate';
import { UrlGenerate } from './common/utils/url-generate';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlValidate: UrlValidate,
  ) {}

  @Get()
  async getRoot() {
    console.log('hello from app controller');
    return { message: 'hello' };
  }

  @Get('/:newUrl')
  @Redirect('', 302)
  async redirectUrl(@Param('newUrl') newUrl: string) {
    const getUrlInfo = await this.appService.getUrl(newUrl);
    const redirectUrl = getUrlInfo.url;

    return { url: redirectUrl };
  }

  @Post('/shorten')
  @UseGuards(IpLogger)
  async shortenUrl(@Body() dto: UrlDTO, @Req() req: Request) {
    let ip = req.ip;

    const isUrl = await this.urlValidate.isUrl(dto);
    if (!isUrl)
      throw new InternalServerErrorException('유효한 형태의 URL이 아닙니다.');

    const shortenUrl = await this.appService.shortenUrl(dto, ip);
    return { shortenUrl };
  }
}
