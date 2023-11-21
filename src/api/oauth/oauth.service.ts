// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { UsersEntity } from 'src/entities/user.entity';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import * as bcrypt from 'bcrypt'
// import { JwtPayload } from 'src/jwt/jwt.payload';

// @Injectable()
// export class OauthService {
//     constructor(
//         @InjectRepository(UsersEntity)
//         private readonly userRepository: Repository<UsersEntity>,
//     ){}

//     async validateUser(payload: JwtPayload) {
//         const username = payload.username;
//         const password = payload.username;
//        const user = await this.userRepository.findOne({where: {username}})
//        console.log(user)
//         if (!user) throw new InternalServerErrorException('유저가 없습니다.')
//         if (!await bcrypt.compare(password, user.password)) throw new InternalServerErrorException('암호가 틀립니다.')
//         return user
//     }
// }
