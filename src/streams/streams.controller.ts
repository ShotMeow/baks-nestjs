import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StreamsService } from './streams.service';
import { Prisma } from '@prisma/client';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Get('/:id')
  async getStreamById(@Param('id') id: string) {
    return this.streamsService.stream(+id);
  }

  @Get()
  async getStreams(
    @Query() query: { page?: string; search: string; take?: string },
  ) {
    return this.streamsService.streams({
      ...query,
      page: query.page && +query.page,
      take: query.take && +query.take,
    });
  }

  @Post('/create')
  @FormDataRequest()
  async createStream(@Body() data: CreateStreamDto) {
    return this.streamsService.createStream(data);
  }

  @Patch('/:id/edit')
  @FormDataRequest()
  async updateStream(@Param('id') id: string, @Body() data: UpdateStreamDto) {
    return this.streamsService.updateStream(+id, data);
  }

  @Delete('/:id/delete')
  async deleteStream(@Param('id') id: string) {
    return this.streamsService.deleteStream(+id);
  }
}
