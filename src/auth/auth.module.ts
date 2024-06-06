import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { ImagesModule } from '../images/images.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    ImagesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    NestjsFormDataModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, UsersService],
})
export class AuthModule {}
