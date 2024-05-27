import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [TournamentsController],
  imports: [PrismaModule],
  providers: [TournamentsService, PrismaService],
})
export class TournamentsModule {}
