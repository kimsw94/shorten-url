import {
  Injectable,
  Inject,
  InternalServerErrorException,
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
import { UrlEntity } from 'src/entities/url.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private datasource: DataSource,
  ) {}
  async signUp(dto: UsersDTO, clientIp: string) {
    const username = dto.username;

    if(!dto.username) throw new InternalServerErrorException('ID를 입력해주세요.');
    if(!dto.password) throw new InternalServerErrorException('패스워드를 입력해주세요.');
    if(!dto.phone) throw new InternalServerErrorException('전화번호를 입력해주세요.');
    if(!dto.address) throw new InternalServerErrorException('주소를 입력해주세요.');

    const isExist = await this.userRepository.findOne({ where: { username } });
    if (isExist) throw new InternalServerErrorException('ID가 중복되었습니다.');
    
    const signUp = await this.usersRepository.signUp(dto, clientIp);
    return signUp;
  }

  async signIn(dto: UsersDTO) {
    const username = dto.username;

    const isExist = await this.userRepository.findOne({
      where: { username },
    });
    if (!isExist)
      throw new InternalServerErrorException('ID가 존재하지 않습니다.');

    const isPassword = await this.usersRepository.getHashedPassword(username);
    if (!isPassword)
      throw new BadRequestException('올바른 패스워드를 입력해주세요');

    const isMatched = await bcrypt.compare(dto.password, isPassword);
    if (!isMatched)
      throw new InternalServerErrorException('패스워드가 틀렸습니다.');
    const user = await this.userRepository.findOne({
      where: { username },
    });

    const jwt = await this.jwtService.signAsync({
      username: username,
    });

    return { user, jwt };
  }

  async findUserByUsername(username: string) {
    try {
      const user: UsersEntity = await this.userRepository.findOne({
        where: { username },
      });
      if (!user) throw new BadRequestException('유저가 없습니다.');
      return user;
    } catch (error) {
      throw new BadRequestException('잘못된 요청입니다');
    }
  }
}
