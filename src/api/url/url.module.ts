import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UrlController } from './url.controller'
import { UrlEntity } from '../../entities/url.entity'
import { UrlService } from './url.service'
import { UrlRepository } from '../../repo/url.repository'

@Module({
    imports: [
        TypeOrmModule.forFeature([UrlEntity])
    ],
    providers: [UrlService, UrlRepository],
    controllers: [UrlController],
    exports: [UrlService],
})

export class UrlModule { }