import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StreamsService {
  constructor(private prisma: PrismaService) {}

  async stream(streamWhereUniqueInput: Prisma.StreamWhereUniqueInput) {
    return this.prisma.stream.findUnique({
      where: streamWhereUniqueInput,
    });
  }

  async streams() {
    return this.prisma.stream.findMany();
  }

  async createStream(data: Prisma.StreamCreateInput) {
    return this.prisma.stream.create({
      data,
    });
  }

  async updateStream(
    where: Prisma.StreamWhereUniqueInput,
    data: Prisma.StreamUpdateInput,
  ) {
    return this.prisma.stream.update({
      where,
      data,
    });
  }

  async deleteStream(where: Prisma.StreamWhereUniqueInput) {
    return this.prisma.stream.delete({
      where,
    });
  }
}
