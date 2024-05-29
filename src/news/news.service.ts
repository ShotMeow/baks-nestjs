import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

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

  async createPost(
    data: Prisma.NewsCreateInput & {
      tags: number[];
    },
  ) {
    return this.prisma.news.create({
      data: {
        ...data,
        tags: {
          create: data.tags?.map((tagId) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
      },
    });
  }

  async updatePost(
    where: Prisma.NewsWhereUniqueInput,
    data: Prisma.NewsUpdateInput & { tags: number[] },
  ) {
    const currentTags = await this.prisma.tagsOnNews.findMany({
      where: { newsId: where.id },
      select: {
        tagId: true,
      },
    });

    const currentTagIds = currentTags.map((tag) => tag.tagId);

    const tagsChanged =
      JSON.stringify(currentTagIds.sort()) !== JSON.stringify(data.tags.sort());

    return this.prisma.$transaction(async (prisma) => {
      await prisma.news.update({
        where,
        data: {
          title: data.title,
          artworkUrl: data.artworkUrl,
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

        const newTagRelations = data.tags.map((tagId) => ({
          tagId,
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

    return this.prisma.news.delete({
      where,
    });
  }
}
