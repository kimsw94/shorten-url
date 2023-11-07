import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UrlEntity } from '../../entities/url.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UrlService {
  private readonly logger = new Logger()

  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ) { }
}