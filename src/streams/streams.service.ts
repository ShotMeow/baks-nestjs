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

  async stream(streamWhereUniqueInput: Prisma.StreamWhereUniqueInput) {
    return this.prisma.stream.findUnique({
      where: streamWhereUniqueInput,
    });
  }

  async streams() {
    return this.prisma.stream.findMany();
  }

  async createStream(data: CreateStreamDto) {
    const imagePath = await this.imagesService.uploadImage(data.imageFile);
    return this.prisma.stream.create({
      data: {
        title: data.title,
        description: data.description,
        channel: data.channel,
        posterUrl: imagePath,
      },
    });
  }

  async updateStream(
    where: Prisma.StreamWhereUniqueInput,
    data: UpdateStreamDto,
  ) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      const stream = await this.prisma.stream.findUnique({ where });
      await this.imagesService.deleteImage(stream.posterUrl);
      delete data.imageFile;
    }

    return this.prisma.stream.update({
      where,
      data: {
        ...data,
        posterUrl: imagePath,
      },
    });
  }

  async deleteStream(where: Prisma.StreamWhereUniqueInput) {
    const stream = await this.prisma.stream.delete({
      where,
    });
    await this.imagesService.deleteImage(stream.posterUrl);

    return stream;
  }
}
