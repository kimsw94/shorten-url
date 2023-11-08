import { Body, Param, Controller, Get, Logger, Post, Query, Req, Res, Redirect } from '@nestjs/common';
import { UrlDTO } from "./dtos/url.dto";
import { UrlService } from './url.service';
// import { Response } from 'express'
// import { IpLogger } from '../../../middleware/iplogger'

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
        return { url: getUrlInfo };
    }

    @Post('shorten')
    async shortenUrl(@Body() dto: UrlDTO){
        const shortenUrl = await this.urlService.shortenUrl(dto);
        return { shortenUrl }
    }
}