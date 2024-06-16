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
import { NewsService } from './news.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get('/:id/view')
  async addView(@Param('id') id: string) {
    return this.newsService.addView(+id);
  }

  @Get()
  async getPosts(
    @Query()
    query: {
      page?: string;
      search: string;
      tag?: string;
      take?: string;
      sort: 'asc' | 'desc';
    },
  ) {
    return this.newsService.posts({
      ...query,
      page: query.page && +query.page,
      take: query.take && +query.take,
    });
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string) {
    return this.newsService.post(+id);
  }

  @Post('/create')
  @FormDataRequest()
  async createPost(
    @Body()
    data: CreatePostDto,
  ) {
    return this.newsService.createPost(data);
  }

  @Patch('/:id/edit')
  @FormDataRequest()
  async updatePost(@Param('id') id: string, @Body() data: UpdatePostDto) {
    return this.newsService.updatePost(+id, data);
  }

  @Delete('/:id/delete')
  async deletePost(@Param('id') id: string) {
    return this.newsService.deletePost(+id);
  }
}
