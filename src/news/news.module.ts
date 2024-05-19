import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService, PrismaService],
})
export class NewsModule {}
