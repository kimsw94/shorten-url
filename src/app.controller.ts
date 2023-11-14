import { Controller, Get, Redirect, Param, Res } from '@nestjs/common';
import { AppService } from './app.service'

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {}

  @Get('')
  async getRoot() {
    console.log("hello from app controller")
    return
  }

  @Get('/:newUrl')
  @Redirect('', 302)
  
  async redirectUrl(@Param('newUrl') newUrl: string) {
    const getUrlInfo = await this.appService.getUrl(newUrl);
    const redirectUrl = getUrlInfo.url;

    return { url: redirectUrl };
  }
}

