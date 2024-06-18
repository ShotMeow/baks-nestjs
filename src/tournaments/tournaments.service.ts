import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ImagesService } from '../images/images.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async tournament(id: number) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      include: {
        teams: {
          select: {
            team: {
              include: {
                players: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    return {
      ...tournament,
      teams: tournament.teams.map(({ team }) => team),
      tags: tournament.tags.map(({ tag }) => tag),
    };
  }

  async tournaments({
    page = 1,
    search = '',
    tag,
    take = 13,
    sort = 'desc',
  }: {
    page: number;
    search: string;
    tag?: string;
    take?: number;
    sort: 'asc' | 'desc';
  }) {
    const skip = (page - 1) * take;

    const totalTournamentsCount = await this.prisma.tournament.count({
      where: {
        name: {
          contains: search,
        },
        tags: tag && {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      },
    });

    const pagesCount = Math.ceil(totalTournamentsCount / take);
    const visiblePages = 5;

    const tournaments = await this.prisma.tournament.findMany({
      take,
      skip,
      where: {
        name: {
          contains: search,
        },
        tags: tag && {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      },
      include: {
        teams: {
          select: {
            team: {
              include: {
                players: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: true,
          },
        },
      },
      orderBy: {
        updatedAt: sort,
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
      itemsCount: totalTournamentsCount,
    };

    return {
      data: tournaments.map((tournament) => ({
        ...tournament,
        teams: tournament.teams.map(({ team }) => team),
        tags: tournament.tags.map(({ tag }) => tag),
      })),
      pagination,
    };
  }

  async createTournament(data: CreateTournamentDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      delete data.imageFile;
    }

    return this.prisma.tournament.create({
      data: {
        ...data,
        artworkUrl: imagePath,
        prize: +data.prize,
        teams: {
          create: data.teams?.map((teamId) => ({
            team: {
              connect: {
                id: +teamId,
              },
            },
          })),
        },
        tags: {
          create: data.tags?.map((tagId) => ({
            tag: {
              connect: {
                id: +tagId,
              },
            },
          })),
        },
      },
    });
  }

  async updateTournament(id: number, data: UpdateTournamentDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      const tournament = await this.prisma.tournament.findUnique({
        where: {
          id,
        },
      });
      await this.imagesService.deleteImage(tournament.artworkUrl);
      delete data.imageFile;
    }

    const currentTags = await this.prisma.tagsOnNews.findMany({
      where: { newsId: id },
      select: {
        tagId: true,
      },
    });

    const currentTagIds = currentTags?.map((tag) => tag.tagId);

    const tagsChanged = currentTagIds
      ? JSON.stringify(currentTagIds.sort()) !==
        (data.tags ? JSON.stringify(data.tags.map((tag) => +tag).sort()) : '')
      : false;

    const currentTeams = await this.prisma.teamsOnTournaments.findMany({
      where: { tournamentId: id },
      select: {
        teamId: true,
      },
    });

    const currentTeamIds = currentTeams?.map((team) => team.teamId);

    const teamsChanged = currentTeamIds
      ? JSON.stringify(currentTeamIds.sort()) !==
        (data.teams
          ? JSON.stringify(data.teams.map((team) => +team).sort())
          : '')
      : false;

    return this.prisma.$transaction(async (prisma) => {
      if (teamsChanged) {
        await prisma.teamsOnTournaments.deleteMany({
          where: {
            tournamentId: id,
          },
        });

        if (data.teams) {
          const newTeamRelations = data.teams.map((teamId) => ({
            teamId: +teamId,
            tournamentId: id,
          }));

          await prisma.teamsOnTournaments.createMany({
            data: newTeamRelations,
          });
        }
      }

      if (tagsChanged) {
        await prisma.tagsOnTournaments.deleteMany({
          where: {
            tournamentId: id,
          },
        });

        if (data.tags) {
          const newTagRelations = data.tags.map((tagId) => ({
            tagId: +tagId,
            tournamentId: id,
          }));

          await prisma.tagsOnTournaments.createMany({
            data: newTagRelations,
          });
        }
      }

      return prisma.tournament.update({
        where: { id },
        data: {
          name: data.name,
          body: data.body,
          description: data.description,
          prize: +data.prize,
          mode: data.mode,
          type: data.type,
          artworkUrl: imagePath,
          address: data.address,
          gridUrl: data.gridUrl,
          eventDate: data.eventDate,
        },
      });
    });
  }

  async deleteTournament(id: number) {
    await this.prisma.tagsOnTournaments.deleteMany({
      where: {
        tournamentId: id,
      },
    });

    await this.prisma.teamsOnTournaments.deleteMany({
      where: {
        tournamentId: id,
      },
    });

    const tournament = await this.prisma.tournament.delete({
      where: {
        id,
      },
    });

    await this.imagesService.deleteImage(tournament.artworkUrl);

    return tournament;
  }
}
