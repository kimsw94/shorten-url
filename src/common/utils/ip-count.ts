import { UrlRepository } from '../../repo/url.repository';
import { UrlDTO } from '../../api/urls/dtos/url.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class IpCount {
  constructor(private readonly urlRepository: UrlRepository) {}

  async ipCount(dto: UrlDTO, clientIp: string) {
    let today = startOfDay(new Date()).toISOString();
    let tomorrow = endOfDay(new Date()).toISOString();

    if (!dto.originalUrl)
      throw new InternalServerErrorException('단축할 URL을 입력해주세요.');

    const count = await this.urlRepository.countIp(clientIp, today, tomorrow);
    return count;
  }
}
