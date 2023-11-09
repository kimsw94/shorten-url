import { Injectable, Logger } from '@nestjs/common'
import { UrlUtil } from './utils/url-save.util'
import { UrlRepository } from '../../repo/url.repository'
import { UrlDTO } from './dtos/url.dto'

@Injectable()
export class UrlService {
  private readonly logger = new Logger()

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly urlUtil: UrlUtil
  ) { }

  async getUrl(newUrl: string) {
    const getUrl = await this.urlRepository.redirectInfo(newUrl);
    return getUrl
  }

  async shortenUrl(dto: UrlDTO, ip: string) {    
 
    if(!dto.url) return { "message" : "단축할 URL을 입력해주세요." }

        const count = await this.urlRepository.countIp(ip)
        if (count > 30 ) return { "message ": "입력 값이 30회를 초과하였습니다." }
        
        const check = await this.urlRepository.getUrlInfo(dto)
        if (check) {
            return { message: "단축된 URL이 존재합니다." } 
        }
        if (!check) {
            await this.urlRepository.saveInfo(dto, ip)
            
            const getNewUrl = await this.urlUtil.newUrl(dto, ip);
            await this.urlRepository.saveNewUrl(dto, getNewUrl)
            
            return { "message": "Success" };
        }
    }
}