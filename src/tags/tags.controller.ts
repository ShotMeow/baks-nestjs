import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { Prisma } from '@prisma/client';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get(':id')
  async getTagById(@Param('id') id: Prisma.TagWhereUniqueInput) {
    return this.tagsService.tag({ id: Number(id) });
  }

  @Get()
  async getTags() {
    return this.tagsService.tags();
  }

  @Post()
  async createTag(@Body() tag: Prisma.TagCreateInput) {
    return this.tagsService.createTag(tag);
  }

  @Patch(':id')
  async updateTag(
    @Param('id') id: Prisma.TagWhereUniqueInput,
    @Body() tag: Prisma.TagUpdateInput,
  ) {
    return this.tagsService.updateTag({ id: Number(id) }, tag);
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: Prisma.TagWhereUniqueInput) {
    return this.tagsService.deleteTag({ id: Number(id) });
  }
}
