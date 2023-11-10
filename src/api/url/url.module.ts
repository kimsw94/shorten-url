import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UrlController } from './url.controller'
import { UrlService } from './url.service'
import { UrlRepository } from '../../repo/url.repository'
import { UrlUtil } from './utils/url-save.util'
import { UrlEntity } from '../../entities/url.entity'
import { IpLogMiddleware } from 'middleware/ip-log.middleware'

@Module({
    imports: [
        TypeOrmModule.forFeature([UrlEntity]),
    ],
    controllers: [UrlController],
    providers: [UrlService, UrlRepository, UrlUtil]
})

export class UrlModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(IpLogMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
