import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';
import { ImagesModule } from '../images/images.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [NewsController],
  imports: [PrismaModule, ImagesModule, NestjsFormDataModule],
  providers: [NewsService, PrismaService],
})
export class NewsModule {}
