import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signIn.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(data: SignInDto) {
    const user = await this.usersService.user({ email: data.email });

    if (!user) {
      throw new NotFoundException('Неверный E-mail или пароль');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Пароли не совпадают');
    }

    return {
      jwtToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async signUp(data: CreateUserDto) {
    const user = await this.usersService.createUser(data);

    return {
      jwtToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async getAuthUser(userId: number) {
    return this.usersService.user({
      id: userId,
    });
  }
}
