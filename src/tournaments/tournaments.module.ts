import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService, PrismaService],
})
export class TournamentsModule {}
