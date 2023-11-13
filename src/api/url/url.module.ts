import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from '../../repo/url.repository';
import { UrlSaveUtil } from './utils/url-save.util';
import { UrlEntity } from '../../entities/url.entity';
import { UrlValidateUtil } from './utils/url-validate.util';
import { IpLogger } from '../../common/utils/ip-logger';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository, UrlSaveUtil, UrlValidateUtil],
})
export class UrlModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(IpLogger)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
