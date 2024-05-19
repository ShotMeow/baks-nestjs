import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StreamsService } from './streams.service';
import { Prisma } from '@prisma/client';

@Controller('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Get(':id')
  async getStreamById(@Param('id') id: Prisma.StreamWhereUniqueInput) {
    return this.streamsService.stream({ id: Number(id) });
  }

  @Get()
  async getStreams() {
    return this.streamsService.streams();
  }

  @Post()
  async createStream(@Body() data: Prisma.StreamCreateInput) {
    return this.streamsService.createStream(data);
  }

  @Patch(':id')
  async updateStream(
    @Param('id') id: Prisma.StreamWhereUniqueInput,
    @Body() data: Prisma.StreamUpdateInput,
  ) {
    return this.streamsService.updateStream({ id: Number(id) }, data);
  }

  @Delete(':id')
  async deleteStream(@Param('id') id: string) {
    return this.streamsService.deleteStream({ id: Number(id) });
  }
}
