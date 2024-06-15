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
import { FormDataRequest } from 'nestjs-form-data';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('/:id')
  async getTagById(@Param('id') id: string) {
    return this.tagsService.tag(+id);
  }

  @Get()
  async getTags(@Query() query: { search: string }) {
    return this.tagsService.tags(query);
  }

  @Post('/create')
  @FormDataRequest()
  async createTag(@Body() tag: CreateTagDto) {
    return this.tagsService.createTag(tag);
  }

  @Patch('/:id/edit')
  @FormDataRequest()
  async updateTag(@Param('id') id: string, @Body() tag: UpdateTagDto) {
    return this.tagsService.updateTag(+id, tag);
  }

  @Delete('/:id/delete')
  async deleteTag(@Param('id') id: string) {
    return this.tagsService.deleteTag(+id);
  }
}
