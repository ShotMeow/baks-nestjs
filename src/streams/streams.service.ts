import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
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

  async streams({ search = '', take }: { search: string; take?: string }) {
    return this.prisma.stream.findMany({
      take: take && +take,
      where: {
        title: {
          contains: search,
        },
      },
    });
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
