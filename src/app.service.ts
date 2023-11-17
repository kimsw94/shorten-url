import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppRepository } from './repo/app.repository';
import { UrlGenerate } from './common/utils/url-generate';
import { IpCount } from './common/utils/ip-count';
import { UrlDTO } from './dtos/app.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly appRepository: AppRepository,
    private readonly urlGenerate: UrlGenerate,
    private readonly ipCount: IpCount,
  ) {}

  async getUrl(newUrl: string) {
    const getUrl = await this.appRepository.redirectInfo(newUrl);
    return getUrl;
  }

  async shortenUrl(dto: UrlDTO, clientIp: string) {
    let check;
    let getNewUrl;

    if (!dto.url)
      throw new InternalServerErrorException('단축할 URL을 입력해주세요.');

    const count = await this.ipCount.ipCount(dto, clientIp);
    if (count > 30)
      throw new InternalServerErrorException(
        '요청 횟수가 30회를 초과하였습니다.',
      );

    do {
      getNewUrl = await this.urlGenerate.newUrlByRandom();
      check = await this.appRepository.getNewUrlInfo(getNewUrl);
      if (!check) {
        await this.appRepository.saveInfo(dto, clientIp, getNewUrl);
        return { message: 'URL을 단축하였습니다.', getNewUrl };
      }
    } while (!check);

    // const getNewUrl = await this.urlGenerate.newUrlByRandom();
    // const check = await this.appRepository.getNewUrlInfo(getNewUrl);
    // if (!check) {
    //   await this.appRepository.saveInfo(dto, clientIp, getNewUrl);
    //   return { message: 'URL을 단축하였습니다.', getNewUrl };
    // } else {
    //   throw new InternalServerErrorException('다시 시도해주세요');
    // }
  }
}
