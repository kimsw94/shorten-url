import { Body, Controller, Get, Logger, Post, Query, Req } from '@nestjs/common'
import { UrlDTO } from "./dtos/url.dto"
import { UrlService } from './url.service'

@Controller('shorten')
export class UrlController {
    constructor(private readonly urlService: UrlService) { }
    @Post('url')
    async shortUrl(@Body() dto: UrlDTO) {
        console.log("Hello From Controlle@@@@@@@@@@@@@@@@@@r")
        const url = await this.urlService.getUrl(dto)
        return { url }
    }
}