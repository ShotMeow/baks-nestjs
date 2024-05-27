import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [TeamsController],
  imports: [PrismaModule],
  providers: [TeamsService, PrismaService],
})
export class TeamsModule {}
