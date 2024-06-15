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

  async tags({ search = '' }: { search: string }) {
    return this.prisma.tag.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
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
