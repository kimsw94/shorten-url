import {
  Controller,
  Get,
  Redirect,
  Param,
  Req,
  Body,
  Post,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { UrlDTO } from './dtos/app.dto';
import { UrlValidate } from './common/utils/url-validate';
import { IpClean } from './common/utils/ip-clean';

@Controller()
export class AppController {
  private DEV_MODE: boolean;
  
  constructor(
    private readonly appService: AppService,
    private readonly urlValidate: UrlValidate,
    private readonly ipClean: IpClean,
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
  async shortenUrl(@Body() dto: UrlDTO, @Req() req: Request) {
    const clientIp = await this.ipClean.clientIpClean(req);
    const serverIp = await this.ipClean.serverIpClean(req);
    const serverPort = process.env.PORT;

    const isUrl = await this.urlValidate.isUrl(dto);
    if (!isUrl) throw new InternalServerErrorException('유효한 형태의 URL이 아닙니다.');

    const shortenUrl = await this.appService.shortenUrl(dto, clientIp);
    const getNewUrl = `http://${serverIp}:${serverPort}/${shortenUrl.getNewUrl}`;
    shortenUrl.getNewUrl = getNewUrl;
    return shortenUrl;
  }
}
