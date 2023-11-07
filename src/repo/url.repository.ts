import { EntityManager } from 'typeorm'
import { UrlEntity } from "../entities/url.entity"
import { Injectable } from '@nestjs/common'

type UrlDataType = {
    url: string,
    id: number,
    shorten_url: string,
}

@Injectable()
export class UrlRepository {
    constructor(
        private readonly entityManager: EntityManager
    ) { }
    
    async getUrl(url: string, manager?: EntityManager) {
        let repo = null;
        if(manager) {
            repo = manager.getRepository(UrlEntity)
        } else {
            repo = this.entityManager;
        }

        let urlRepo = repo
        const urlInfo = await urlRepo
            .where()
            .getOne()
        return urlInfo
    }

}