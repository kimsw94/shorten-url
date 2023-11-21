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
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    
    // OauthModule,
  ],
  providers: [UsersService, ConfigService, UsersRepository, IpClean, JwtStrategy],
  controllers: [UsersController]
})
export class UsersModule {}
