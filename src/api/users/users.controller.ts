import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersDTO } from './dtos/users.dto';
import { UrlValidate } from 'src/common/utils/url-validate';
import { UrlService } from '../urls/url.service';
import { IpClean } from 'src/common/utils/ip-clean';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { EmailValidate } from 'src/common/utils/email-validate';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly urlService: UrlService,
    private readonly urlValidate: UrlValidate,
    private readonly emailValidate: EmailValidate,
    private readonly jwtService: JwtService,
    private readonly ipClean: IpClean,
  ) {}

  @Post('sign-up')
  async signUp(@Body() dto: UsersDTO, @Req() req: Request) {
    const clientIp = await this.ipClean.clientIpClean(req);
    const isEmail = await this.emailValidate.isEmail(dto);
    if (!isEmail)
      throw new InternalServerErrorException('유효한 형태의 이메일이 아닙니다.')
    const signUp = await this.usersService.signUp(dto, clientIp);
    return signUp;
  }

  @Post('sign-in')
  @UseGuards(JwtAuthGuard)
  async signIn(
    @Body() dto: UsersDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, jwt } = await this.usersService.signIn(dto);
    res.cookie('jwt', jwt, { httpOnly: false });

    return { success: true, user: user, jwt };
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async userWithdraw(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwtCookie = req.cookies[process.env.JWT_KEY];
    const userId = this.jwtService.decode(jwtCookie)['id'];
    const withdraw = await this.usersService.withdraw(userId);

    return { success: true, withdraw };
  }
}
