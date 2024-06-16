import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async tag(id: number) {
    return this.prisma.tag.findUnique({
      where: { id },
    });
  }

  async tags({
    page = 1,
    search = '',
    take = 10,
  }: {
    page?: number;
    take?: number;
    search: string;
  }) {
    const skip = (page - 1) * take;

    const totalTagsCount = await this.prisma.tag.count();

    const pagesCount = Math.ceil(totalTagsCount / take);
    const visiblePages = 5;

    const tags = await this.prisma.tag.findMany({
      take,
      skip,
      where: {
        name: {
          contains: search,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const pagination = {
      currentPage: page,
      lastPage: pagesCount,
      pages: Array.from(
        { length: pagesCount > visiblePages ? visiblePages : pagesCount },
        (_, k) => {
          let startPage = 1;

          // Проверяем, нужно ли сдвигать начальную страницу
          if (pagesCount > visiblePages && page > Math.ceil(visiblePages / 2)) {
            startPage = Math.min(
              pagesCount - visiblePages + 1,
              Math.max(1, page - Math.floor(visiblePages / 2)),
            );
          }

          return startPage + k;
        },
      ).filter((p) => p >= 1 && p <= pagesCount),
      itemsCount: totalTagsCount,
    };

    return {
      data: tags,
      pagination,
    };
  }

  async createTag(data: CreateTagDto) {
    return this.prisma.tag.create({
      data,
    });
  }

  async updateTag(id: number, data: UpdateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }

  async deleteTag(id: number) {
    return this.prisma.tag.delete({
      where: { id },
    });
  }
}
