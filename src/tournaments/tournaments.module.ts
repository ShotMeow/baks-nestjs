import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';
import { ImagesModule } from '../images/images.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [TournamentsController],
  imports: [PrismaModule, ImagesModule, NestjsFormDataModule],
  providers: [TournamentsService, PrismaService],
})
export class TournamentsModule {}
