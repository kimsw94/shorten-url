import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { UrlSaveUtil } from './utils/url-save.util'
import { UrlRepository } from '../../repo/url.repository'
import { UrlDTO } from './dtos/url.dto'

@Injectable()
export class UrlService {

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly urlSaveUtil: UrlSaveUtil
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
    if (check) return { message: "단축된 URL이 존재합니다." } 
        
    if (!check) {
            
      //원본 URL을 저장합니다.
      await this.urlRepository.saveInfo(dto, ip)
      const getNewUrl = await this.urlSaveUtil.newUrl(dto, ip);

      //단축 URL을 저장합니다.
      await this.urlRepository.saveNewUrl(dto, getNewUrl)
      return { "message": "success" };
    
    }
  }
}