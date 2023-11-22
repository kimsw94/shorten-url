import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UrlEntity } from 'src/entities/url.entity';
import { UrlGenerate } from 'src/common/utils/url-generate';
import { UrlValidate } from 'src/common/utils/url-validate';
import { IpCount } from 'src/common/utils/ip-count';
import { IpClean } from 'src/common/utils/ip-clean';
import { UrlRepository } from 'src/repo/url.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UrlEntity,
      UsersEntity
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false
    }),
    UrlEntity,
  ],
  providers: [
    UrlService,
    UrlRepository,
    JwtService,
    IpCount,
    IpClean,
    UrlValidate,
    UrlGenerate,
  ],
  controllers: [UrlController],
})
export class UrlModule {}
