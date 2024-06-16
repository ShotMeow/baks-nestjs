import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
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

  async user(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
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

  async users({
    page = 1,
    take = 10,
    search = '',
  }: {
    page?: number;
    take?: number;
    search: string;
  }) {
    const skip = (page - 1) * take;

    const totalUsersCount = await this.prisma.user.count();

    const users = await this.prisma.user.findMany({
      take,
      skip,
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

    const pagesCount = Math.ceil(totalUsersCount / take);
    const visiblePages = 5;

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
      itemsCount: totalUsersCount,
    };

    return {
      data: users.map((user) => ({
        ...user,
        team: {
          ...user.team,
          tournaments: user.team?.tournaments?.map(
            ({ tournament }) => tournament,
          ),
        },
      })),
      pagination,
    };
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

  async updateUser(id: number, data: UpdateUserDto) {
    let imagePath: string;
    if (data?.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      delete data.imageFile;
    }

    if (data?.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        pictureUrl: imagePath,
        killDeaths: +data.killDeaths,
        deaths: +data.deaths,
        assists: +data.assists,
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: {
        id: +id,
      },
    });
  }
}
