// import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule, JwtModuleAsyncOptions, JwtService } from '@nestjs/jwt';
// import { JwtStrategy } from 'src/jwt/jwt.strategy';
// import { OauthService } from './oauth.service';
// import { OauthController } from './oauth.controller';
// import { UsersEntity } from 'src/entities/user.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config'; // ConfigModule 및 ConfigService 추가

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([UsersEntity]),
//     PassportModule.register({
//       defaultStrategy: [process.env.JWT_KEY],
//       session: false}),
//     JwtModule.register({
//       secret: process.env.SECRET_KEY,
//       secretOrPrivateKey: process.env.SECRET_KEY,
//       signOptions: { expiresIn: '1d' },
//     }),
//   ],
//   providers: [OauthService, OauthController, ConfigService, JwtService, JwtStrategy],
//   exports: [OauthService],
// })
// export class OauthModule {}
