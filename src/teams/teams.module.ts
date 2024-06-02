import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';
import { ImagesModule } from '../images/images.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [TeamsController],
  imports: [PrismaModule, ImagesModule, NestjsFormDataModule],
  providers: [TeamsService, PrismaService],
})
export class TeamsModule {}
