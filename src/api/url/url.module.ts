import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from '../../repo/url.repository';
import { UrlGenerate } from './utils/url-generate';
import { UrlEntity } from '../../entities/url.entity';
import { IpLogger } from '../../common/utils/ip-logger';
import { UrlValidate } from './utils/url-validate'

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository, UrlGenerate, UrlValidate],
})
export class UrlModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpLogger)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
