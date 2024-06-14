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
import { TagsService } from './tags.service';
import { Prisma } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('/:id')
  async getTagById(@Param('id') id: Prisma.TagWhereUniqueInput) {
    return this.tagsService.tag({ id: Number(id) });
  }

  @Get()
  async getTags(@Query() query: { search: string }) {
    return this.tagsService.tags(query);
  }

  @Post('/create')
  @FormDataRequest()
  async createTag(@Body() tag: Prisma.TagCreateInput) {
    return this.tagsService.createTag(tag);
  }

  @Patch('/:id/edit')
  @FormDataRequest()
  async updateTag(
    @Param('id') id: Prisma.TagWhereUniqueInput,
    @Body() tag: Prisma.TagUpdateInput,
  ) {
    return this.tagsService.updateTag({ id: Number(id) }, tag);
  }

  @Delete('/:id/delete')
  async deleteTag(@Param('id') id: Prisma.TagWhereUniqueInput) {
    return this.tagsService.deleteTag({ id: Number(id) });
  }
}
