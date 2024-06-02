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
import { FormDataRequest } from 'nestjs-form-data';

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
  @FormDataRequest()
  async createTag(@Body() tag: Prisma.TagCreateInput) {
    return this.tagsService.createTag(tag);
  }

  @Patch(':id')
  @FormDataRequest()
  async updateTag(
    @Param('id') id: Prisma.TagWhereUniqueInput,
    @Body() tag: Prisma.TagUpdateInput,
  ) {
    console.log(tag);
    return this.tagsService.updateTag({ id: Number(id) }, tag);
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: Prisma.TagWhereUniqueInput) {
    return this.tagsService.deleteTag({ id: Number(id) });
  }
}
