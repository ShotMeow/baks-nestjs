import { Module } from '@nestjs/common';
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';
import { ImagesModule } from '../images/images.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [StreamsController],
  imports: [PrismaModule, ImagesModule, NestjsFormDataModule],
  providers: [StreamsService, PrismaService],
})
export class StreamsModule {}
