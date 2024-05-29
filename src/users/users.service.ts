import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({
      where,
      include: {
        team: {
          include: {
            tournaments: {
              include: {
                tournament: true,
              },
            },
          },
        },
      },
    });

    return {
      ...user,
      team: {
        ...user.team,
        tournaments: user.team.tournaments.map(({ tournament }) => tournament),
      },
    };
  }

  async users(where: Prisma.UserWhereInput) {
    return this.prisma.user.findMany({
      where,
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    data.password = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }
}
