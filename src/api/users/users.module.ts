import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from 'src/entities/user.entity';
import { UsersRepository } from 'src/repo/user.repository';
import { ConfigService } from '@nestjs/config'
import { IpClean } from 'src/common/utils/ip-clean';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { UrlEntity } from 'src/entities/url.entity';
import { UrlValidate } from 'src/common/utils/url-validate';
import { UrlService } from '../urls/url.service';
import { UrlRepository } from 'src/repo/url.repository';
import { UrlGenerate } from 'src/common/utils/url-generate';
import { IpCount } from 'src/common/utils/ip-count';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      UrlEntity
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false
    }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    
    // OauthModule,
  ],
  providers: [UsersService, ConfigService, UsersRepository, IpClean, JwtStrategy, UrlValidate, UrlService, UrlRepository, UrlGenerate, IpClean, IpCount],
  controllers: [UsersController]
})
export class UsersModule {}
