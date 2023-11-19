import { Controller, Get, Redirect, Post, Req, Body, Param, InternalServerErrorException} from '@nestjs/common';
import { Request } from 'express'
import { UrlService } from './url.service';
import { UrlDTO } from 'src/dtos/app.dto';
import { IpClean } from 'src/common/utils/ip-clean';
import { UrlValidate } from 'src/common/utils/url-validate';
 

@Controller()
export class UrlController {
    constructor (
        private readonly urlService: UrlService,
        private readonly ipClean: IpClean,
        private readonly urlValidate: UrlValidate
    ) {}

    @Get(':newUrl')
    @Redirect('', 302)
    async redirectUrl(@Param('newUrl') newUrl: string) {
      console.log("hello from redirect")
        const getUrlInfo = await this.urlService.getUrl(newUrl);
      const redirectUrl = getUrlInfo.url;
  
      return { url: redirectUrl };
    }
    
    @Post('shorten')
    async shortenUrl(@Body() dto: UrlDTO, @Req() req: Request) {
      console.log("hello from shorten")
    const clientIp = await this.ipClean.clientIpClean(req);
      const serverIp = await this.ipClean.serverIpClean(req);
      const serverPort = process.env.PORT;
  
      const isUrl = await this.urlValidate.isUrl(dto);
      if (!isUrl) throw new InternalServerErrorException('유효한 형태의 URL이 아닙니다.');
  
      const shortenUrl = await this.urlService.shortenUrl(dto, clientIp);
      const getNewUrl = `http://${serverIp}:${serverPort}/${shortenUrl.getNewUrl}`;
      shortenUrl.getNewUrl = getNewUrl;
      return shortenUrl;
    }
}
