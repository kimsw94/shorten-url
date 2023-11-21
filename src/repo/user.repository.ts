import { EntityManager } from 'typeorm';
import { UsersEntity } from 'src/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UsersDTO } from 'src/api/users/dtos/users.dto';
import * as bcrypt from 'bcrypt';

type UserDataType = {
  id?: number;
  username?: string;
  password?: string;
  phone?: string;
  address?: string;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async signUp(dto: UsersDTO, clientIp: string, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
      repo = repo.createQueryBuilder();
    } else {
      repo = this.entityManager;
      repo = repo.createQueryBuilder();
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const result = await repo
      .insert()
      .into('users')
      .values({
        username: dto.username,
        password: hashedPassword,
        address: dto.address,
        phone: dto.phone,
        ip: clientIp,
      })
      .execute();

    return { result };
  }

  async getHashedPassword(username: string, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
      repo = repo.createQueryBuilder();
    } else {
      repo = this.entityManager;
      repo = repo.createQueryBuilder();
    }
   
    const result = await repo
      .select('users.password') // 엔터티의 별칭과 함께 필드 선택
      .from('users') // 엔터티 클래스와 엔터티의 별칭 설정
      .where('users.username = :username', { username }) // 플레이스홀더 사용
      .getOne();

    return result.password;
  }

  async getUserInfo(username: string, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
      repo = repo.createQueryBuilder();
    } else {
      repo = this.entityManager;
      repo = repo.createQueryBuilder();
    }
   
    const result = await repo
      .select() // 엔터티의 별칭과 함께 필드 선택
      .from('users') // 엔터티 클래스와 엔터티의 별칭 설정
      .where('users.username = :username', { username }) // 플레이스홀더 사용
      .getOne();
    console.log(result)
    return result;
  }
}
