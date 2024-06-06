import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './dto/signIn.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @FormDataRequest()
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('/sign-up')
  @FormDataRequest()
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getAuthUser(@User() { id }: { id: number }) {
    return this.authService.getAuthUser(id);
  }
}
