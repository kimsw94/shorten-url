import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UrlEntity } from 'src/entities/url.entity';
import { UrlGenerate } from 'src/common/utils/url-generate';
import { UrlValidate } from 'src/common/utils/url-validate';
import { IpCount } from 'src/common/utils/ip-count';
import { IpClean } from 'src/common/utils/ip-clean';
import { AppRepository } from 'src/repo/app.repository';

@Module({
  imports: [UrlEntity],
  providers: [
    UrlService, AppRepository, IpCount, IpClean, UrlValidate, UrlGenerate
  ],
  controllers: [UrlController]
})
export class UrlModule { }
