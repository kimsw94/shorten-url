import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller('')
export class AppController {

  @Get()
  async getRoot() {
    console.log('hello from app controller');
    return { message: 'hello' };
  }
}