import {
  Injectable,
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from 'src/repo/user.repository';
import { UsersEntity } from 'src/entities/user.entity';
import { UsersDTO } from './dtos/users.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private datasource: DataSource,
  ) {}
  async signUp(dto: UsersDTO, clientIp: string) {
    const signUp = await this.usersRepository.signUp(dto, clientIp);
    return signUp;
  }

  async verifyUserAndSignJwt(username: string,password: string,
  ): Promise<{ jwt: string; dto: UsersDTO }> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) throw new InternalServerErrorException('유저가 없습니다.');
    if (!user.password)
      throw new UnauthorizedException('USER_VERIFY_JWT_SOCIAL_USER_BLOCK');
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('USER_VERIFY_JWT_PASSWORD_NOT_MATCH');
    try {
      const jwt = await this.jwtService.signAsync(
        {
          id: user.id,
          username: user.username,
          platform: 'mmc',
        },
        { secret: this.configService.get('SECRET_KEY') },
      );
      return
    } catch (error) {
      throw new InternalServerErrorException('USER_VERIFY_EXCEPTION');
    }
  }

  async signIn(dto: UsersDTO) {
    const username = dto.username;

    const isExist = await this.usersRepository.getHashedPassword(username);
    if (!isExist) throw new InternalServerErrorException('ID가 존재하지 않습니다.');

    const isMatched = await bcrypt.compare(dto.password, isExist);
    if (!isMatched) throw new InternalServerErrorException('패스워드가 틀렸습니다.');
        const user = await this.userRepository.findOne({
        where: { username },
      });
    
    const jwt = await this.jwtService.signAsync(
        {
          username: username,
        })
     
    return { user, jwt }
    }

    async findUserByUsername(username: string) {
        try {
          const user: UsersEntity = await this.userRepository.findOne({
            where: { username },
          })
          if (!user) throw new Error()
          return user
        } catch (error) {
          throw new BadRequestException('ADMIN_FIND_MANAGER')
        }
      }
}
