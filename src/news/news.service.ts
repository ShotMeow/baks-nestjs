import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ImagesService } from '../images/images.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async addView(id: number) {
    return this.prisma.news.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  async post(id: number) {
    const post = await this.prisma.news.findUnique({
      where: {
        id,
      },
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

  async posts({
    search,
    tag,
    take,
    sort = 'desc',
  }: {
    search: string;
    tag: string;
    take?: string;
    sort: 'asc' | 'desc';
  }) {
    const news = await this.prisma.news.findMany({
      take: take && +take,
      where: {
        title: {
          contains: search,
        },
        tags: tag && {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        updatedAt: sort,
      },
    });

    return news.map((post) => ({
      ...post,
      tags: post.tags?.map(({ tag }) => tag),
    }));
  }

  async createPost(data: CreatePostDto) {
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

  async updatePost(id: number, data: UpdatePostDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      const post = await this.prisma.news.findFirst({
        where: { id },
      });
      await this.imagesService.deleteImage(post.artworkUrl);
      delete data.imageFile;
    }

    const currentTags = await this.prisma.tagsOnNews.findMany({
      where: { newsId: id },
      select: {
        tagId: true,
      },
    });

    const currentTagIds = currentTags?.map((tag) => tag.tagId);

    const tagsChanged =
      currentTagIds && data.tags
        ? JSON.stringify(currentTagIds.sort()) !==
          (data.tags ? JSON.stringify(data.tags.map((tag) => +tag).sort()) : '')
        : false;

    return this.prisma.$transaction(async (prisma) => {
      await prisma.news.update({
        where: { id },
        data: {
          title: data.title,
          artworkUrl: imagePath,
          description: data.description,
          body: data.body,
          updatedAt: new Date(),
        },
      });

      if (tagsChanged) {
        await prisma.tagsOnNews.deleteMany({
          where: {
            newsId: id,
          },
        });

        if (data.tags) {
          const newTagRelations = data.tags.map((tagId) => ({
            tagId: +tagId,
            newsId: id,
          }));
          await prisma.tagsOnNews.createMany({
            data: newTagRelations,
          });
        }
      }
    });
  }

  async deletePost(id: number) {
    await this.prisma.tagsOnNews.deleteMany({
      where: {
        newsId: id,
      },
    });

    const post = await this.prisma.news.delete({
      where: { id },
    });

    await this.imagesService.deleteImage(post.artworkUrl);

    return post;
  }
}
