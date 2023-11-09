import { Injectable, Logger } from '@nestjs/common'
import { UrlUtil } from './utils/url-save.util'
import { UrlRepository } from '../../repo/url.repository'
import { UrlDTO } from './dtos/url.dto'

type NewUrlType = {
    getNewUrl: string
}

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
        //newUrl
        //saveNewUrl
        const date = new Date
        if(!dto.url) return { "message" : "단축할 URL을 입력해주세요." }

        const count = await this.urlRepository.countIp(ip, date)
        if (count > 30) return { "message" : "30회 요청을 초과하였습니다." }

        const check = await this.urlRepository.getUrlInfo(dto)
        if (check) {
            return { message: "단축된 URL이 존재합니다." } 
        }
        if (!check) {
            console.log(dto)
            await this.urlRepository.saveInfo(dto, ip)
            const getNewUrl = await this.urlUtil.newUrl(dto, ip);
            console.log(getNewUrl)
            await this.urlRepository.saveNewUrl(dto, getNewUrl)
            return { "message": "Success" };
        }
    }
}