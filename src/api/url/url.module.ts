import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UrlController } from './url.controller'
import { UrlService } from './url.service'
import { UrlRepository } from '../../repo/url.repository'
import { UrlEntity } from '../../entities/url.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([UrlEntity])
    ],
    controllers: [UrlController],
    providers: [UrlService, UrlRepository]
})

export class UrlModule { }