import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersDTO } from './dtos/users.dto';
import { UrlValidate } from 'src/common/utils/url-validate';
import { UrlService } from '../urls/url.service';
import { IpClean } from 'src/common/utils/ip-clean';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly urlService: UrlService,
    private readonly urlValidate: UrlValidate,
    private readonly ipClean: IpClean,
  ) {}

  @Post('sign-up')
  async signUp(@Body() dto: UsersDTO, @Req() req: Request) {
    const clientIp = await this.ipClean.clientIpClean(req);
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
}
