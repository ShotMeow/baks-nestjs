import { Module } from '@nestjs/common';
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [StreamsController],
  providers: [StreamsService, PrismaService],
})
export class StreamsModule {}
