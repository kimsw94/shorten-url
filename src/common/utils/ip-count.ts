import { AppRepository } from '../../repo/app.repository';
import { UrlDTO } from '../../dtos/app.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class IpCount {
  constructor(private readonly appRepository: AppRepository) {}

  async ipCount(dto: UrlDTO, clientIp: string) {
    let today = startOfDay(new Date()).toISOString();
    let tomorrow = endOfDay(new Date()).toISOString();

    if (!dto.url)
      throw new InternalServerErrorException('단축할 URL을 입력해주세요.');

    const count = await this.appRepository.countIp(clientIp, today, tomorrow);
    return count
  }
}
