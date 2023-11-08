import { EntityManager } from 'typeorm'
import { UrlEntity } from "../entities/url.entity"
import { Injectable } from '@nestjs/common'

type UrlDataType = {
    url: string,
    id: number,
    shorten_url: string,
    ip: string,
}


export class UrlRepository {
    // constructor(
    //     private readonly entityManager: EntityManager
    // ) { }
}