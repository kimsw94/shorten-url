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
import { JwtService } from '@nestjs/jwt';

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly urlValidate: UrlValidate,
    private readonly jwtService: JwtService,
    private readonly ipClean: IpClean,
  ) {}

  @Get(':newUrl')
  @Redirect('', 302)
  async redirectUrl(@Param('newUrl') newUrl: string) {
    const getUrlInfo = await this.urlService.getUrl(newUrl);
    const redirectUrl = getUrlInfo.originalUrl;

    return { url: redirectUrl };
  }

  @Get('shorten/list')
  @UseGuards(JwtAuthGuard)
  async listUp(@Req() req: Request) {
    const jwtCookie = req.cookies[process.env.JWT_KEY];
    const id = this.jwtService.decode(jwtCookie)['id'];
    if(!id) throw new InternalServerErrorException('로그인 후 이용해주세요')

    const list = await this.urlService.listUp(id);
    if (!list) throw new UnauthorizedException('생성된 단축 URL이 없습니다.');
    return { list: list };
  }

  @Post('shorten')
  @UseGuards(JwtAuthGuard)
  async shortenUserUrl(@Body() dto: UrlDTO, @Req() req: Request) {
    let userId;
    let clientIp = await this.ipClean.clientIpClean(req);
    let serverIp = await this.ipClean.serverIpClean(req);
    let serverPort = process.env.PORT;

    const isUrl = await this.urlValidate.isUrl(dto);
    if (!isUrl)
      throw new InternalServerErrorException('유효한 형태의 URL이 아닙니다.');

    const jwtCookie = req.cookies[process.env.JWT_KEY];
    if (jwtCookie) {
      userId = this.jwtService.decode(jwtCookie)['id'];
    }

    const shortenUrl = await this.urlService.shortenUrl(dto, clientIp, userId);
    const getNewUrl = `http://${serverIp}:${serverPort}/${shortenUrl.getNewUrl}`;
    shortenUrl.getNewUrl = getNewUrl;
    return { originalUrl: getNewUrl };
  }
}
