import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UrlRepository } from '../../repo/url.repository'
import { UrlEntity } from '../../entities/url.entity'
import { UrlDTO } from './dtos/url.dto'

@Injectable()
export class UrlService {
  private readonly logger = new Logger()

  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: UrlRepository,
  ) { }

  async duplicatedUrl(dto: UrlDTO) {

  }

  async shortenUrl(dto: UrlDTO) {
    const url = new URL(dto.url)
    const host = url.origin;
    const path = url.pathname;
    // const getUrlInfo = await this.urlRepository.getUrlInfo(url.dto);
    // if(!getUrlInfo) await
    // if(getUrlInfo) await
    // return { }
  }
}