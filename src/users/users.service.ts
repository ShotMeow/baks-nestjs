import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

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
        tournaments: user.team?.tournaments?.map(
          ({ tournament }) => tournament,
        ),
      },
    };
  }

  async users({ search = '' }: { search: string }) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            nickname: {
              contains: search,
            },
          },
          {
            name: {
              contains: search,
            },
          },
          {
            team: {
              name: {
                contains: search,
              },
            },
          },
        ],
      },
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

    return users.map((user) => ({
      ...user,
      team: {
        ...user.team,
        tournaments: user.team?.tournaments?.map(
          ({ tournament }) => tournament,
        ),
      },
    }));
  }

  async createUser(data: CreateUserDto) {
    const imagePath = await this.imagesService.uploadImage(data.imageFile);
    delete data.imageFile;
    data.password = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        pictureUrl: imagePath,
      },
    });
  }

  async updateUser(where: Prisma.UserWhereUniqueInput, data: UpdateUserDto) {
    let imagePath: string;
    if (data?.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      delete data.imageFile;
    }

    if (data?.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }

    return this.prisma.user.update({
      where,
      data: {
        ...data,
        pictureUrl: imagePath,
        killDeaths: +data.killDeaths,
        deaths: +data.deaths,
        assists: +data.assists,
      },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }
}
