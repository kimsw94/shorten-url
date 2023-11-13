import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from '../../repo/url.repository';
import { UrlSaveUtil } from './utils/url-save.util';
import { UrlEntity } from '../../entities/url.entity';
import { IpLogger } from '../../common/utils/ip-logger';
import { isUrl } from './utils/url-validate.util';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository, UrlSaveUtil, isUrl],
})
export class UrlModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(IpLogger, isUrl)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
