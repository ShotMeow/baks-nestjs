import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateStreamDto } from './dto/create-stream.dto';
import { ImagesService } from '../images/images.service';
import { UpdateStreamDto } from './dto/update-stream.dto';

@Injectable()
export class StreamsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async stream(id: number) {
    return this.prisma.stream.findUnique({
      where: { id },
    });
  }

  async streams({
    page = 1,
    search = '',
    take = 12,
  }: {
    page?: number;
    search: string;
    take?: number;
  }) {
    const totalStreamsCount = await this.prisma.stream.count({
      where: {
        title: {
          contains: search,
        },
      },
    });

    const skip = take && (page - 1) * take;

    const streams = await this.prisma.stream.findMany({
      take: !search ? take : undefined,
      skip: !search ? skip : undefined,
      where: {
        title: {
          contains: search,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const pagesCount = Math.ceil(totalStreamsCount / take);
    const visiblePages = 5;

    const pagination = {
      currentPage: page,
      lastPage: pagesCount,
      pages: Array.from(
        { length: pagesCount > visiblePages ? visiblePages : pagesCount },
        (_, k) => {
          let startPage = 1;

          if (pagesCount > visiblePages && page > Math.ceil(visiblePages / 2)) {
            startPage = Math.min(
              pagesCount - visiblePages + 1,
              Math.max(1, page - Math.floor(visiblePages / 2)),
            );
          }

          return startPage + k;
        },
      ).filter((p) => p >= 1 && p <= pagesCount),
      itemsCount: totalStreamsCount,
    };

    return {
      data: streams,
      pagination,
    };
  }

  async createStream(data: CreateStreamDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      delete data.imageFile;
    }

    return this.prisma.stream.create({
      data: {
        title: data.title,
        description: data.description,
        channel: data.channel,
        posterUrl: imagePath,
      },
    });
  }

  async updateStream(id: number, data: UpdateStreamDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      const stream = await this.prisma.stream.findUnique({ where: { id } });
      await this.imagesService.deleteImage(stream.posterUrl);
      delete data.imageFile;
    }

    return this.prisma.stream.update({
      where: { id },
      data: {
        ...data,
        posterUrl: imagePath,
      },
    });
  }

  async deleteStream(id: number) {
    const stream = await this.prisma.stream.delete({
      where: { id },
    });
    await this.imagesService.deleteImage(stream.posterUrl);

    return stream;
  }
}
