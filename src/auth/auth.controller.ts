import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body);
  }

  @Post('/sign-up')
  async signUp(@Body() body: Prisma.UserCreateInput) {
    return this.authService.signUp(body);
  }
}
