import { Injectable } from '@nestjs/common';
import { IpCount } from './ip-count';
import { UrlDTO } from '../../dtos/app.dto';

@Injectable()
export class UrlGenerate {
  constructor(private readonly ipCount: IpCount) {}

  async newUrlByTime(dto: UrlDTO, ip: string) {
    const time = Number(new Date());
    const count = await this.ipCount.ipCount(dto, ip);
    function timeTo62(time: number): string {
      const characters =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const base = characters.length;
      let result = '';

      do {
        const remainder = time % base;
        result = characters[remainder] + result;
        time = Math.floor(time / base);
      } while (time > 0);

      return result;
    }

    function countTo62(count: number): string {
      const characters =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const base = characters.length;
      let result = '';

      do {
        const remainder = count % base;
        result = characters[remainder] + result;
        count = Math.floor(count / base);
      } while (count > 0);

      return result;
    }

    const encodedCount = countTo62(count);
    const encodedTime = timeTo62(time);

    return `${encodedTime}${encodedCount}`;
  }

  async newUrlByRandom() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }
}
