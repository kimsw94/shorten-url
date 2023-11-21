import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersDTO } from './dtos/users.dto';
import { IpClean } from 'src/common/utils/ip-clean';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ipClean: IpClean,
  ) {}

  @Post('sign-up')
  async signUp(@Body() dto: UsersDTO, @Req() req: Request) {
    const clientIp = await this.ipClean.clientIpClean(req);
    const signUp = await this.usersService.signUp(dto, clientIp);
    return signUp;
  }

  // @Post('sign-in')
  // @UseGuards(JwtAuthGuard)
  // async signIn(@Body() dto: UsersDTO) {
  
  //   const username = dto.username
  //   const password = dto.password
  //   const user = await this.usersService.verifyUserAndSignJwt(username, password);
  //   return { user: user, success: true };
  // }

  @Post('sign-in')
  @UseGuards(JwtAuthGuard)
  async signIn(@Body() dto: UsersDTO, @Req() req: Request) {
    const user = await this.usersService.signIn(dto);
    return { 
      message: "success",
      jwt: user.jwt
    }
}
}
