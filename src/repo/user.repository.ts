import { EntityManager } from 'typeorm';
import { UsersEntity } from 'src/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UsersDTO } from 'src/api/users/dtos/users.dto';
import * as bcrypt from 'bcrypt';

type UserDataType = {
  id?: number;
  email?: string;
  password?: string;
  nickname?: string;
  phone?: string;
};

type OptionType = {
  with_deleted?: boolean;
}

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
        email: dto.email,
        password: hashedPassword,
        nickname: dto.nickname,
        phone: dto.phone,
        ip: clientIp,
      })
      .execute();

    return { result };
  }

  async getHashedPassword(email: string, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
      repo = repo.createQueryBuilder();
    } else {
      repo = this.entityManager;
      repo = repo.createQueryBuilder();
    }

    const result = await repo
      .select('users.password')
      .from('users')
      .where('users.email = :email', { email })
      .getOne();

    return result.password;
  }

  async getUserInfoById(userId: number, option: OptionType, manager?: EntityManager) {
    let repo = null;
    if (manager) {
        repo = manager.getRepository(UsersEntity);
        repo = repo.createQueryBuilder('u')
    } else {
        repo = this.entityManager;
        repo = repo.createQueryBuilder('users', 'u')
    }

    let userRepo = repo
    if (option?.with_deleted) {
        userRepo = userRepo.withDeleted()
      }
    
    const userInfo = await userRepo
        .where('u.id = :userId', { userId })
        .getOne();

    return userInfo
}

  async getUserInfo(email: string, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
      repo = repo.createQueryBuilder();
    } else {
      repo = this.entityManager;
      repo = repo.createQueryBuilder();
    }

    const result = await repo
      .select()
      .from('users')
      .where('users.email = :email', { email }) // 플레이스홀더 사용
      .getOne();

    return result;
  }

  async banUser(userId: number, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
    } else {
      repo = this.entityManager;
    }

    const updateResult = await repo
      .createQueryBuilder()
      .softDelete()
      .from('users')
      .where('id = :userId', { userId })
      .execute();
    return updateResult;
  }

  async unbanUser(userId: number, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
    } else {
      repo = this.entityManager;
    }
    const updateResult = await repo
      .createQueryBuilder()
      .update('users')
      .set({
        deleted_at: null,
      })
      .where('id = :userId', { userId })
      .execute();
    return updateResult;
  }

  async modifyUser(userId: number, dto: UserDataType, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
    } else {
      repo = this.entityManager;
    }
    const updateResult = await repo
      .createQueryBuilder()
      .update('users')
      .set({
        nickname: dto.nickname,
        email: dto.email,
        phone: dto.phone,
      })
      .where('id = :userId', { userId })
      .execute();
    return updateResult;
  }

  async modifyUserWithPassword(
    userId: number,
    dto: UserDataType,
    manager?: EntityManager,
  ) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
    } else {
      repo = this.entityManager;
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const updateResult = await repo
      .createQueryBuilder()
      .update('users')
      .set({
        nickname: dto.nickname,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
      })
      .where('id = :userId', { userId })
      .execute();
    return updateResult;
  }

  async resetUserPassword(userId: number, manager?: EntityManager) {
    let repo = null;
    if (manager) {
      repo = manager.getRepository(UsersEntity);
    } else {
      repo = this.entityManager;
    }
    const password = '12345678';
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateResult = await repo
      .createQueryBuilder()
      .update('users')
      .set({
        password: hashedPassword,
      })
      .where('id = :userId', { userId })
      .execute();
    return updateResult;
  }
}
