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
  async createPost(
    @Body()
    data: Prisma.NewsCreateInput & {
      tags: number[];
    },
  ) {
    return this.newsService.createPost(data);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: Prisma.NewsWhereUniqueInput,
    @Body() data: Prisma.NewsUpdateInput & { tags: number[] },
  ) {
    return this.newsService.updatePost({ id: Number(id) }, data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: Prisma.NewsWhereUniqueInput) {
    return this.newsService.deletePost({ id: Number(id) });
  }
}
