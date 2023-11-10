import { Injectable } from '@nestjs/common'
import { UrlRepository } from '../../../repo/url.repository'
import { UrlDTO } from '../dtos/url.dto'

@Injectable()
export class UrlUtil {
    
    constructor(
        private readonly urlRepository: UrlRepository,
      ) { }
      
    async newUrl(dto: UrlDTO, ip: string) {
        // 변환할 고유한 Url의 id값을 데이터베이스에서 불러옵니다.
        const data = await this.urlRepository.getUrlInfo(dto)
        const id = data.id
        if(!id) await this.urlRepository.saveInfo(dto, ip)

        //알고리즘을 이용하여 새로운 URL을 생성합니다. 함수에 사용된 알고리즘은 ID값을 62진수로 변환합니다. 
        function decimalTo62(id: number): string {
            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const base = characters.length;
            let result = '';
        
            do {
            const remainder = id % base;
            result = characters[remainder] + result;
            id = Math.floor(id / base);
            } while (id > 0);
        
            return result;
        }
        const encodedId = decimalTo62(id);
        return encodedId
    }

    async dayCount() {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 
        return { today, tomorrow }
    }
}