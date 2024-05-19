import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async tag(tagWhereUniqueInput: Prisma.TagWhereUniqueInput) {
    return this.prisma.tag.findUnique({
      where: tagWhereUniqueInput,
    });
  }

  async tags() {
    return this.prisma.tag.findMany();
  }

  async createTag(data: Prisma.TagCreateInput) {
    return this.prisma.tag.create({
      data,
    });
  }

  async updateTag(
    where: Prisma.TagWhereUniqueInput,
    data: Prisma.TagUpdateInput,
  ) {
    return this.prisma.tag.update({
      where,
      data,
    });
  }

  async deleteTag(where: Prisma.TagWhereUniqueInput) {
    return this.prisma.tag.delete({
      where,
    });
  }
}
