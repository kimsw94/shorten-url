import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UrlRepository } from './repo/url.repository';
import { UrlGenerate } from './common/utils/url-generate';
import { UrlValidate } from './common/utils/url-validate';
import { UrlDTO } from './api/url/dtos/url.dto';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AppService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly urlGenerate: UrlGenerate,
    private readonly urlValidate: UrlValidate,
  ) {}

  async getUrl(newUrl: string) {
    const getUrl = await this.urlRepository.redirectInfo(newUrl);
    return getUrl;
  }

  async shortenUrl(dto: UrlDTO, ip: string) {
    let today = startOfDay(new Date()).toISOString();
    let tomorrow = endOfDay(new Date()).toISOString();

    if (!dto.url)
      throw new InternalServerErrorException('단축할 URL을 입력해주세요.');

    const count = await this.urlRepository.countIp(ip, today, tomorrow);
    if (count > 30)
      throw new InternalServerErrorException(
        '요청 횟수가 30회를 초과하였습니다.',
      );

    const check = await this.urlRepository.getUrlInfo(dto);
    if (check)
      throw new InternalServerErrorException('단축된 URL이 존재합니다.');

    if (!check) {
      //원본 URL을 저장합니다.
      await this.urlRepository.saveInfo(dto, ip);
      const getNewUrl = await this.urlGenerate.newUrl(dto, ip);

      //단축 URL을 저장합니다.
      await this.urlRepository.saveNewUrl(dto, getNewUrl);
      return { message: 'URL을 단축하였습니다.', getNewUrl };
    }
  }
}
