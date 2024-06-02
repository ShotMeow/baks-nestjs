import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { ImagesService } from '../images/images.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async post(newsWhereUniqueInput: Prisma.NewsWhereUniqueInput) {
    const post = await this.prisma.news.findUnique({
      where: newsWhereUniqueInput,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return {
      ...post,
      tags: post.tags.map(({ tag }) => tag),
    };
  }

  async posts() {
    const news = await this.prisma.news.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return news.map((post) => ({
      ...post,
      tags: post.tags.map(({ tag }) => tag),
    }));
  }

  async createPost(data: CreatePostDto) {
    console.log(data);
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      delete data.imageFile;
    }

    return this.prisma.news.create({
      data: {
        ...data,
        artworkUrl: imagePath,
        tags: {
          create: data.tags?.map((tagId) => ({
            tag: {
              connect: {
                id: +tagId,
              },
            },
          })),
        },
      },
    });
  }

  async updatePost(where: Prisma.NewsWhereUniqueInput, data: UpdatePostDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      delete data.imageFile;
    }

    const currentTags = await this.prisma.tagsOnNews.findMany({
      where: { newsId: where.id },
      select: {
        tagId: true,
      },
    });

    const currentTagIds = currentTags?.map((tag) => tag.tagId);

    const tagsChanged =
      currentTagIds && data.tags
        ? JSON.stringify(currentTagIds.sort()) !==
          JSON.stringify(data.tags.map((tag) => +tag).sort())
        : false;

    const post = await this.prisma.news.findFirst({
      where,
    });

    await this.imagesService.deleteImage(post.artworkUrl);

    return this.prisma.$transaction(async (prisma) => {
      await prisma.news.update({
        where,
        data: {
          title: data.title,
          artworkUrl: imagePath,
          description: data.description,
          body: data.body,
        },
      });

      if (tagsChanged) {
        await prisma.tagsOnNews.deleteMany({
          where: {
            newsId: where.id,
          },
        });

        const newTagRelations = data.tags?.map((tagId) => ({
          tagId: +tagId,
          newsId: where.id,
        }));
        await prisma.tagsOnNews.createMany({
          data: newTagRelations,
        });
      }
    });
  }

  async deletePost(where: Prisma.NewsWhereUniqueInput) {
    await this.prisma.tagsOnNews.deleteMany({
      where: {
        newsId: where.id,
      },
    });

    const post = await this.prisma.news.delete({
      where,
    });

    await this.imagesService.deleteImage(post.artworkUrl);

    return post;
  }
}
