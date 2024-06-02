import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  async getPosts() {
    return this.newsService.posts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: Prisma.NewsWhereUniqueInput) {
    return this.newsService.post({ id: Number(id) });
  }

  @Post()
  @FormDataRequest()
  async createPost(
    @Body()
    data: CreatePostDto,
  ) {
    return this.newsService.createPost(data);
  }

  @Patch(':id')
  @FormDataRequest()
  async updatePost(
    @Param('id') id: Prisma.NewsWhereUniqueInput,
    @Body() data: UpdatePostDto,
  ) {
    return this.newsService.updatePost({ id: Number(id) }, data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: Prisma.NewsWhereUniqueInput) {
    return this.newsService.deletePost({ id: Number(id) });
  }
}
