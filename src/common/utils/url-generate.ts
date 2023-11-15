import { Injectable } from '@nestjs/common';
import { UrlRepository } from '../../repo/url.repository';
import { UrlDTO } from '../../api/url/dtos/url.dto';

@Injectable()
export class UrlGenerate {
  constructor(private readonly urlRepository: UrlRepository) {}

  async newUrl(dto: UrlDTO, ip: string) {
    // URL의 id값을 불러옵니다.
    const data = await this.urlRepository.getUrlInfo(dto);
    const id = data.id;
    if (!id) await this.urlRepository.saveInfo(dto, ip);

    //ID값을 62진수로 변환합니다.
    function decimalTo62(id: number): string {
      const characters =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const base = characters.length;
      let result = '';

      do {
        const remainder = id % base;
        result = characters[remainder] + result;
        id = Math.floor(id / base);
      } while (id > 0);

      return result;
    }

    const encodedId = decimalTo62(id);

    return encodedId;
  }
}
