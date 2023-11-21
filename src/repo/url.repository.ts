import { EntityManager } from 'typeorm'
import { UrlEntity } from "../entities/url.entity"
import { Injectable } from '@nestjs/common'

type UrlDataType = {
    originalUrl: string,
    newUrl: string,
    ip: string;
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
            repo = repo.createQueryBuilder('urls', 'u')
        }

        const result = await repo
            .select(['u.originalUrl'])
            .where('u.newUrl = :newUrl', { newUrl })
            .getOne()
  
        return result
    }

    async countIp(clientIp: String, today:string, tomorrow: string, manager?: EntityManager) {
        let repo = null;

        if(manager) {
            repo = manager.getRepository(UrlEntity)
            repo = repo.createQueryBuilder('u')
        } else {
            repo = this.entityManager
            repo = repo.createQueryBuilder('urls', 'u')
        }
      
        const count = await repo
            .select('u.ip')
            .where('u.ip = :ip', { ip: clientIp })
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
            repo = repo.createQueryBuilder('urls', 'u')
        }

        const url = dto.originalUrl
        const result = await repo
            .where('u.originalUrl = :originalUrl', { url })
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
            repo = repo.createQueryBuilder('urls', 'u')
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
            .into('urls')
            .values(
                {
                originalUrl: dto.originalUrl,
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

        const url = dto.originalUrl
        const result = await repo
            .createQueryBuilder()
            .update('urls')
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