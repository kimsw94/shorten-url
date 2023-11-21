import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UrlRepository } from 'src/repo/url.repository';
import { UrlGenerate } from 'src/common/utils/url-generate';
import { IpCount } from 'src/common/utils/ip-count';
import { UrlDTO } from 'src/api/urls/dtos/url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from 'src/entities/url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    @InjectRepository(UrlEntity)
    private readonly urlsRepository: Repository<UrlEntity>,
    private readonly urlGenerate: UrlGenerate,
    private readonly ipCount: IpCount,
  ) {}

  async getUrl(newUrl: string) {
    const getUrl = await this.urlRepository.redirectInfo(newUrl);
    return getUrl;
  }

  async shortenUrl(dto: UrlDTO, clientIp: string) {
    let check;
    let getNewUrl;

    if (!dto.originalUrl)
      throw new InternalServerErrorException('단축할 URL을 입력해주세요.');

    if(!dto.user_id) {
      const count = await this.ipCount.ipCount(dto, clientIp);
      if (count > 30)
        throw new InternalServerErrorException(
          '요청 횟수가 30회를 초과하였습니다.',
        );
    }

    do {
      getNewUrl = await this.urlGenerate.newUrlByRandom();
      check = await this.urlRepository.getNewUrlInfo(getNewUrl);
      if (!check) {
        await this.urlRepository.saveInfo(dto, clientIp, getNewUrl);
        return { message: 'URL을 단축하였습니다.', getNewUrl };
      }
    } while (!check);
  }

  async listUp(id: number) {
    const list = await this.urlsRepository.find({
      where: { user_id: id },
    });
    return list
  }
}
