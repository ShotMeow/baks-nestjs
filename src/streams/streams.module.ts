import { Module } from '@nestjs/common';
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [StreamsController],
  imports: [PrismaModule],
  providers: [StreamsService, PrismaService],
})
export class StreamsModule {}
