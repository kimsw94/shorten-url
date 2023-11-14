import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Req,
  Redirect,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { UrlDTO } from './dtos/url.dto';
import { UrlService } from './url.service';
import { IpLogger } from '../../common/utils/ip-logger';
import { Request } from 'express';
import { UrlValidate } from '../url/utils/url-validate'

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly urlValidate: UrlValidate
  ) {}

  @Post('shorten')
  @UseGuards(IpLogger)
  async shortenUrl(
    @Body() dto: UrlDTO,
    @Req() req: Request,
  ) {

    let ip = req.ip;
    
    const isUrl = await this.urlValidate.isUrl(dto)
    if(!isUrl) throw new InternalServerErrorException("유효한 형태의 URL이 아닙니다.")

    const shortenUrl = await this.urlService.shortenUrl(dto, ip);
    return { shortenUrl };
 
  }
}