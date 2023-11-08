import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UrlRepository } from '../../repo/url.repository'
import { UrlEntity } from '../../entities/url.entity'
import { UrlDTO } from './dtos/url.dto'

@Injectable()
export class UrlService {
  private readonly logger = new Logger()

  constructor(
    private urlRepository: UrlRepository,
  ) { }

  async getUrl(newUrl: string) {
    const getUrl = await this.urlRepository.redirectInfo(newUrl);
    return getUrl
  }

  async shortenUrl(dto: UrlDTO) {    

    if(!dto.url) return { "message" : "단축할 URL을 입력해주세요." }
    const url = await new URL(dto.url)
    const host = await url.origin;
    const path = await url.pathname;
    const ip = await "127.0.0.1"; 
    const newUrl = await Math.random().toString(36).substr(2, 5)

    const data = {
        url: dto.url,
        host: host,
        path: path,
        newUrl: newUrl,
        ip: ip,
    }

    const check = await this.urlRepository.getUrlInfo(data)

    if (!check) {
        const save = await this.urlRepository.saveInfo(data)
        return { save }
    }
    return { message: "단축된 URL이 존재합니다." }
}}