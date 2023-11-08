import { EntityManager } from 'typeorm'
import { UrlEntity } from "../entities/url.entity"
import { UrlDTO } from '../api/url/dtos/url.dto'
import { Injectable } from '@nestjs/common'

type UrlDataType = {
    url: string,
    host: string,
    path: string,
    newUrl: string,
    ip: string
}

type UrlObjectType = {
    url: string
}


@Injectable()
export class UrlRepository {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async redirectInfo(newUrl: String, manager?: EntityManager) {
        let repo = null;
        console.log(newUrl)
        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder('u')
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder('URLS', 'u')
        }

        const result = await repo
            .select(['u.url'])
            .where('u.newUrl = :newUrl', { newUrl })
            .getOne()
  
        return result
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

    async saveInfo(data: UrlDataType, manager?: EntityManager) {
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