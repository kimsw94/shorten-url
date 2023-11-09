import { EntityManager } from 'typeorm'
import { UrlEntity } from "../entities/url.entity"
import { UrlDTO } from '../api/url/dtos/url.dto'
import { Injectable } from '@nestjs/common'

type UrlDataType = {
    url: string,
    host: string,
    path: string,
    newUrl: string,
    ip: string;
}

type IpObjectType = {
    ip: string
}


@Injectable()
export class UrlRepository {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async redirectInfo(newUrl: String, manager?: EntityManager) {
        let repo = null;

        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder('u')
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder('URLS', 'u')
        }

        const result = await repo
            .createQueryBuilder('URLS', 'u')
            .select(['u.url'])
            .where('u.newUrl = :newUrl', { newUrl })
            .getOne()
  
        return result
    }

    async countIp(ip: String, manager?: EntityManager) {
        let repo = null;

        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder('u')
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder('URLS', 'u')
        }
    
        const count = await repo
            .where('u.ip = :ip', { ip })
            .getCount();
  
        return count
    }

    async getUrlInfo(data: UrlDataType, manager?: EntityManager) {
        let repo = null;

        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder('u')
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder('URLS', 'u')
        }

        const url = data.url
        const result = await repo
            .where('u.url = :url', { url })
            .getOne()

        return result
    }

    async saveInfo(data: UrlDataType, ip: string, manager?: EntityManager) {
        let repo = null;
        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder()
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder()
        }
    
        const result = await repo
            .insert()
            .into('URLS')
            .values(
                {
                url: data.url,
                newUrl: data.newUrl,
                path: data.path,
                host: data.host,
                ip: data.ip,
                },
            )
            .execute()
 
        return { result }
    }
}