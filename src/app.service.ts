import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppRepository } from './repo/app.repository';
import { UrlGenerate } from './common/utils/url-generate';
import { UrlValidate } from './common/utils/url-validate';
import { UrlDTO } from './dtos/app.dto';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AppService {
  constructor(
    private readonly appRepository: AppRepository,
    private readonly urlGenerate: UrlGenerate,
    private readonly urlValidate: UrlValidate,
  ) {}

  async getUrl(newUrl: string) {
    const getUrl = await this.appRepository.redirectInfo(newUrl);
    return getUrl;
  }

  async shortenUrl(dto: UrlDTO, ip: string) {
    let today = startOfDay(new Date()).toISOString();
    let tomorrow = endOfDay(new Date()).toISOString();

    if (!dto.url)
      throw new InternalServerErrorException('단축할 URL을 입력해주세요.');

    const count = await this.appRepository.countIp(ip, today, tomorrow);
    if (count > 30)
      throw new InternalServerErrorException(
        '요청 횟수가 30회를 초과하였습니다.',
      );

    const check = await this.appRepository.getUrlInfo(dto);
    if (check) {
      const getNewUrl = check.newUrl;
      return { message: 'URL을 단축하였습니다.', getNewUrl };
    } else {
      //원본 URL을 저장합니다.
      await this.appRepository.saveInfo(dto, ip);
      const getNewUrl = await this.urlGenerate.newUrl(dto, ip);

      //단축 URL을 저장합니다.
      await this.appRepository.saveNewUrl(dto, getNewUrl);
      return { message: 'URL을 단축하였습니다.', getNewUrl };
    }
  }
}
