import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { User } from './decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getAuthUser(@User() { id }: { id: number }) {
    return this.authService.getAuthUser(id);
  }
}
