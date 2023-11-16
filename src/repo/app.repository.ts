import { EntityManager } from 'typeorm'
import { UrlEntity } from "../entities/url.entity"
import { Injectable } from '@nestjs/common'

type UrlDataType = {
    url: string,
    newUrl: string,
    ip: string;
}

@Injectable()
export class AppRepository {
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
            .select(['u.url'])
            .where('u.newUrl = :newUrl', { newUrl })
            .getOne()
  
        return result
    }

    async countIp(ip: String, today:string, tomorrow: string, manager?: EntityManager) {
        let repo = null;

        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder('u')
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder('URLS', 'u')
        }
      
        const count = await repo
            .select('u.ip')
            .where('u.ip = :ip', { ip })
            .andWhere('u.created_at >= :startOfDay', { startOfDay: today })
            .andWhere('u.created_at < :endOfDay', { endOfDay: tomorrow })
            .getCount();
       
        return count
    }

    async getUrlInfo(dto: UrlDataType, manager?: EntityManager) {
        let repo = null;

        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder('u')
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder('URLS', 'u')
        }

        const url = dto.url
        const result = await repo
            .where('u.url = :url', { url })
            .getOne()

        return result
    }

    async getNewUrlInfo(getNewUrl: string, manager?: EntityManager) {
        let repo = null;

        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder('u')
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder('URLS', 'u')
        }

        const result = await repo
            .where('u.newUrl = :newUrl', { newUrl: getNewUrl })
            .getOne()

        return result
    }

    async saveInfo(dto: UrlDataType, ip: string, getNewUrl: string, manager?: EntityManager) {
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
                url: dto.url,
                newUrl: getNewUrl,
                ip: ip,
                },
            )
            .execute()
 
        return { result }
    }

    async saveNewUrl(dto: UrlDataType, getNewUrl: string, manager?: EntityManager) {
        let repo = null;
        if(manager) {
            repo = manager.getRepository(UrlEntity)
        } else {
            repo = this.entityManager
        }

        const url = dto.url
        const result = await repo
            .createQueryBuilder()
            .update('URLS')
            .set(
                {
                newUrl: getNewUrl,
                },
            )
            .where({ url })
            .execute()
 
        return { result }
    }
}