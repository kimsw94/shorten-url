import { Injectable } from '@nestjs/common'
import { UrlDTO } from '../dtos/url.dto'
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UrlValidate {
    async isUrl (dto: UrlDTO) {
    
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.(com|net|org|gov|edu|io|co\.kr)(\/|$)/;


        const urlTest = urlRegex.test(dto.url);
        
        if (!urlTest) return false
        return true
    }
}
