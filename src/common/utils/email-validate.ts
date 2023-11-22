import { Injectable } from '@nestjs/common';
import { UsersDTO } from 'src/api/users/dtos/users.dto';

@Injectable()
export class EmailValidate {
  async isEmail(dto: UsersDTO) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailTest = emailRegex.test(dto.email);

    if (!emailTest) return false;
    return true;
  }
}
