import { Body, Controller, Get, Logger, Post, Query, Req } from '@nestjs/common'
import { UrlService } from './url.service'

export class UrlController {
    constructor(private readonly urlService: UrlService) { }
}