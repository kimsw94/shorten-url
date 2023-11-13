import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UrlGenerate } from './utils/url-generate';
import { UrlRepository } from '../../repo/url.repository';
import { UrlDTO } from './dtos/url.dto';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository, // DB에 저장하기 위한 로직을 별도로 구성하였으며, 이에따라 Repository를 주입하였습니다.
    private readonly urlGenerate: UrlGenerate, // Url을 함수로직 변경의 용이성을 위해, 별도로 구성하였으며, 이에따라 유틸리티를 주입하였습니다.
  ) {}

  async getUrl(newUrl: string) {
    const getUrl = await this.urlRepository.redirectInfo(newUrl); //컨트롤러에서 리디렉팅하기 위해 필요한 정보를 불러옵니다.
    return getUrl;
  }

  async shortenUrl(dto: UrlDTO, ip: string) {
    let today = startOfDay(new Date()).toISOString(); // 동일 IP의 접근 횟수를 알기 위해 필요합니다. (시작)
    let tomorrow = endOfDay(new Date()).toISOString(); // 동일 IP의 접근 횟수를 알기 위해 필요합니다. (끝)

    if (!dto.url) // 서버 리소스를 낭비하지 않도록, URL 입력값이 있는지 먼저 검사합니다.
      throw new InternalServerErrorException('단축할 URL을 입력해주세요.'); // 에러 핸들링을 위해 throw 합니다. throw하기 위해 HttpExceptionHandler가 필요합니다.

    const count = await this.urlRepository.countIp(ip, today, tomorrow); // 필요한 변수를 입력하여, 금일 IP를 조회합니다.
    if (count > 30) // 30회로 설정한 횟수에 따라 분기처리합니다.
      throw new InternalServerErrorException('요청 횟수가 30회를 초과하였습니다.');

    const check = await this.urlRepository.getUrlInfo(dto); // 단축된 URL이 있는지 확인하고 저장합니다.
    if (check) 
      throw new InternalServerErrorException('단축된 URL이 존재합니다.');

    if (!check) {
      //원본 URL을 저장합니다.
      await this.urlRepository.saveInfo(dto, ip); // URL에 매칭된 ID값으로 단축하므로, 먼저 URL을 DB에 저장합니다. 
      const getNewUrl = await this.urlGenerate.newUrl(dto, ip); // URL에 매칭된 ID값으로 유틸리티를 호출하여 단축 URL을 생성합니다. 

      //단축 URL을 저장합니다.
      await this.urlRepository.saveNewUrl(dto, getNewUrl); // 생성된 URL을 기준으로 업데이트를 합니다.
      return { message: 'URL을 단축하였습니다.', getNewUrl }; // 완료되면 응답값을 리턴합니다.
    }
  }
}

// 해당 로직을 분리한 이유는, 트랜잭션 롤백을 최소화하기위해, 서비스 레이어의 함수를 추가 구성하여 트랜잭션 롤백을 최소화하였습니다.
