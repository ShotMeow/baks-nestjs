import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
})
export class TagsModule {}
