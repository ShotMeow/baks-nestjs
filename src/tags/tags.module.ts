import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [TagsController],
  imports: [PrismaModule, NestjsFormDataModule],
  providers: [TagsService, PrismaService],
})
export class TagsModule {}
