import {
    Injectable,
  } from '@nestjs/common';
  import { UrlRepository } from './repo/url.repository';
  
  @Injectable()
  export class AppService {
    constructor(
      private readonly urlRepository: UrlRepository,
    ) {}
  
    async getUrl(newUrl: string) {
      const getUrl = await this.urlRepository.redirectInfo(newUrl);
      return getUrl;
    }
}