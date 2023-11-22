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
    const email = dto.email;

    if (!dto.email)
      throw new InternalServerErrorException('이메일을 입력해주세요.');
    if (!dto.password)
      throw new InternalServerErrorException('패스워드를 입력해주세요.');
    if (!dto.phone)
      throw new InternalServerErrorException('전화번호를 입력해주세요.');
    if (!dto.nickname)
      throw new InternalServerErrorException('닉네임을 입력해주세요.');

    const isExist = await this.userRepository.findOne({ where: { email } });
    if (isExist) throw new InternalServerErrorException('이메일이 중복되었습니다.');

    const signUp = await this.usersRepository.signUp(dto, clientIp);
    return signUp;
  }

  async signIn(dto: UsersDTO) {
    const email = dto.email;

    const isExist = await this.userRepository.findOne({
      where: { email },
    });
    if (!isExist)
      throw new InternalServerErrorException('이메일이 존재하지 않습니다.');

    const isPassword = await this.usersRepository.getHashedPassword(email);
    if (!isPassword)
      throw new BadRequestException('올바른 패스워드를 입력해주세요');

    const isMatched = await bcrypt.compare(dto.password, isPassword);
    if (!isMatched)
      throw new InternalServerErrorException('패스워드가 틀렸습니다.');
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      product_id: user.product_id,
    });

    return { user, jwt };
  }

  async findUserByEmail(email: string) {
    try {
      const user: UsersEntity = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) throw new BadRequestException('유저가 없습니다.');
      return user.id;
    } catch (error) {
      throw new BadRequestException('잘못된 요청입니다');
    }
  }

  async withdraw(userId: number) {
    const userWithdraw = await this.usersRepository.banUser(userId);
    return { userWithdraw }
  }
}
