import {
  Controller,
  Get,
  Redirect,
  Post,
  Req,
  Body,
  Param,
  InternalServerErrorException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UrlService } from './url.service';
import { UrlDTO } from 'src/api/urls/dtos/url.dto';
import { IpClean } from 'src/common/utils/ip-clean';
import { UrlValidate } from 'src/common/utils/url-validate';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly urlValidate: UrlValidate,
    private readonly ipClean: IpClean,
  ) {}

  @Get(':newUrl')
  @Redirect('', 302)
  async redirectUrl(@Param('newUrl') newUrl: string) {
    const getUrlInfo = await this.urlService.getUrl(newUrl);
    const redirectUrl = getUrlInfo.originalUrl;

    return { url: redirectUrl };
  }

  @Post('shorten')
  async shortenUrl(@Body() dto: UrlDTO, @Req() req: Request) {
    const clientIp = await this.ipClean.clientIpClean(req);
    const serverIp = await this.ipClean.serverIpClean(req);
    const serverPort = process.env.PORT;

    const isUrl = await this.urlValidate.isUrl(dto);
    if (!isUrl)
      throw new InternalServerErrorException('유효한 형태의 URL이 아닙니다.');

    const shortenUrl = await this.urlService.shortenUrl(dto, clientIp);
    const getNewUrl = `http://${serverIp}:${serverPort}/${shortenUrl.getNewUrl}`;
    shortenUrl.getNewUrl = getNewUrl;
    return { originalUrl: getNewUrl };
  }

  @Get('url-list/:id')
  @UseGuards(JwtAuthGuard)
  async listUp(@Param() id: number, @Req() req: Request) {
    const list = await this.urlService.listUp(id);
    if(!list) throw new UnauthorizedException('존재하지 않아요')
    return { list: list };
  }

  @Post('shorten/user')
  @UseGuards(JwtAuthGuard)
  async shortenUserUrl(@Body() dto: UrlDTO, @Req() req: Request) {
    const clientIp = await this.ipClean.clientIpClean(req);
    const serverIp = await this.ipClean.serverIpClean(req);
    const serverPort = process.env.PORT;

    const isUrl = await this.urlValidate.isUrl(dto);
    if (!isUrl)
      throw new InternalServerErrorException('유효한 형태의 URL이 아닙니다.');

    const shortenUrl = await this.urlService.shortenUrl(dto, clientIp);
    const getNewUrl = `http://${serverIp}:${serverPort}/${shortenUrl.getNewUrl}`;
    shortenUrl.getNewUrl = getNewUrl;
    return { originalUrl: getNewUrl };
  }
}
