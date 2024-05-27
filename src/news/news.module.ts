import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [NewsController],
  imports: [PrismaModule],
  providers: [NewsService, PrismaService],
})
export class NewsModule {}
