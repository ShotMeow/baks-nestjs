import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../database/prisma.module';
import { PrismaService } from '../database/prisma.service';
import { ImagesModule } from '../images/images.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [PrismaModule, ImagesModule, NestjsFormDataModule],
  exports: [UsersService],
})
export class UsersModule {}
