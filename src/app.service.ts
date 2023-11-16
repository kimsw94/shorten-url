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

  async shortenUrl(dto: UrlDTO, ip: string) {
    if (!dto.url)
      throw new InternalServerErrorException('단축할 URL을 입력해주세요.');

    const count = await this.ipCount.ipCount(dto, ip);
    if (count > 300)
      throw new InternalServerErrorException(
        '요청 횟수가 30회를 초과하였습니다.',
      );

    const getNewUrl = await this.urlGenerate.newUrlByRandom();
    const check = await this.appRepository.getNewUrlInfo(getNewUrl)
    if (!check) await this.appRepository.saveInfo(dto, ip, getNewUrl);
    return { message: 'URL을 단축하였습니다.', getNewUrl };
  }
}
