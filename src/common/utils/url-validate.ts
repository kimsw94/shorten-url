import { Injectable } from '@nestjs/common';
import { UrlDTO } from '../../api/urls/dtos/url.dto';

@Injectable()
export class UrlValidate {
  async isUrl(dto: UrlDTO) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.[^\s]{2,}(\/|$)/;

    const urlTest = urlRegex.test(dto.originalUrl);

    if (!urlTest) return false;
    return true;
  }
}
