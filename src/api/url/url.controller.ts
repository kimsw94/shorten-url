import { Body, Controller, Get, Logger, Post, Query, Req } from '@nestjs/common';
import { UrlDTO } from "./dtos/url.dto";
import { UrlService } from './url.service';

@Controller('shorten')
export class UrlController {
    private readonly logger = new Logger(UrlController.name)

    constructor(
        private readonly urlService: UrlService,
    ) { }

    @Post('shortenUrl')
    async shortenUrl(@Body() dto: UrlDTO){
        const shortenUrl = await this.urlService.shortenUrl(dto);
        return { shortenUrl }
    }
}