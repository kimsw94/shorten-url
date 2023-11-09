import { Body, Param, Controller, Get, Logger, Post, Query, Req, Res, Redirect, UseGuards } from '@nestjs/common';
import { UrlDTO } from "./dtos/url.dto";
import { UrlService } from './url.service';
import { IpLogMiddleware } from 'middleware/ip-log.middleware';
import { Request } from 'express'

@Controller()
export class UrlController {
    private readonly logger = new Logger(UrlController.name)

    constructor(
        private readonly urlService: UrlService,
    ) { }

    @Get('/:newUrl')
    @Redirect('', 302)
    async redirectUrl(@Param('newUrl') newUrl: string){
        const getUrlInfo = await this.urlService.getUrl(newUrl);
        const redirectUrl = getUrlInfo.url
        return { url: redirectUrl };
    }

    @Post('shorten')
    @UseGuards(IpLogMiddleware)
    async shortenUrl(@Body() dto: UrlDTO, @Req() req: Request){

        //URL이 아닌 경우, 서버 리소스를 낭비하지 않도록 컨르롤러에서 분기처리하였습니다.
        const urlCheck = new URL(dto.url)
        if (!urlCheck) return { "message" : "URL형태로 값을 입력해주세요"}

        //URL일 경우, URL을 단축합니다.
        const ip = req.ip
        const shortenUrl = await this.urlService.shortenUrl(dto, ip);
        return { shortenUrl }
    }
}