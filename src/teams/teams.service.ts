import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { ImagesService } from '../images/images.service';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async team(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        players: true,
        tournaments: {
          include: {
            tournament: true,
          },
        },
      },
    });

    return {
      ...team,
      tournaments: team.tournaments.map(({ tournament }) => tournament),
    };
  }

  async teams({
    page = 1,
    search = '',
    take = 10,
    sort = 'desc',
  }: {
    page?: number;
    search: string;
    take?: number;
    sort: 'asc' | 'desc';
  }) {
    const skip = (page - 1) * take;

    const totalTeamsCount = await this.prisma.team.count({
      where: {
        name: {
          contains: search,
        },
      },
    });

    const pagesCount = Math.ceil(totalTeamsCount / take);
    const visiblePages = 5;

    const teams = await this.prisma.team.findMany({
      take,
      skip,
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        players: true,
        tournaments: {
          include: {
            tournament: true,
          },
        },
      },
      orderBy: {
        createdAt: sort,
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
      itemsCount: totalTeamsCount,
    };

    return {
      data: teams.map((team) => ({
        ...team,
        tournaments: team.tournaments.map(({ tournament }) => tournament),
      })),
      pagination,
    };
  }

  async createTeam(data: CreateTeamDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      delete data.imageFile;
    }

    const team = await this.prisma.team.create({
      data: {
        name: data.name,
        body: data.body,
        winsPercent: +data.winsPercent,
        gamesCount: +data.gamesCount,
        lastMatch: data.lastMatch,
        logoUrl: imagePath,
        tournaments: {
          create: data.tournaments?.map((tournamentId) => ({
            tournament: {
              connect: {
                id: +tournamentId,
              },
            },
          })),
        },
      },
    });

    data.players?.map(async (playerId) => {
      await this.prisma.user.update({
        where: {
          id: +playerId,
        },
        data: {
          teamId: team.id,
        },
      });
    });

    return team;
  }

  async updateTeam(id: number, data: UpdateTeamDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      const team = await this.prisma.team.findFirst({
        where: { id },
      });
      await this.imagesService.deleteImage(team.logoUrl);
      delete data.imageFile;
    }

    const users = await this.prisma.user.findMany();

    const playersToAdd = users.filter(
      (user) => data.players?.includes(String(user.id)) && user.teamId !== id,
    );
    console.log(playersToAdd);

    for (const player of playersToAdd) {
      await this.prisma.user.update({
        where: { id: +player.id },
        data: { teamId: id },
      });
    }

    const playersToRemove = users.filter(
      (user) => user.teamId === id && !data.players?.includes(String(user.id)),
    );

    for (const playerToRemove of playersToRemove) {
      await this.prisma.user.update({
        where: { id: playerToRemove.id },
        data: { teamId: null },
      });
    }

    const currentTournaments = await this.prisma.teamsOnTournaments.findMany({
      where: { teamId: id },
      select: {
        tournamentId: true,
      },
    });

    const currentTournamentIds = currentTournaments?.map(
      (tournament) => tournament.tournamentId,
    );

    const tournamentsChanged = currentTournamentIds
      ? JSON.stringify(currentTournamentIds.sort()) !==
        (data.tournaments
          ? JSON.stringify(
              data.tournaments.map((tournament) => +tournament).sort(),
            )
          : '')
      : false;

    return this.prisma.$transaction(async (prisma) => {
      if (tournamentsChanged) {
        await prisma.teamsOnTournaments.deleteMany({
          where: {
            teamId: id,
          },
        });

        if (data.tournaments) {
          const newTournamentsRelations = data.tournaments.map(
            (tournamentId) => ({
              tournamentId: +tournamentId,
              teamId: id,
            }),
          );

          await prisma.teamsOnTournaments.createMany({
            data: newTournamentsRelations,
          });
        }
      }

      return prisma.team.update({
        where: { id },
        data: {
          name: data.name,
          body: data.body,
          winsPercent: +data.winsPercent,
          gamesCount: +data.gamesCount,
          lastMatch: data.lastMatch,
          logoUrl: imagePath,
        },
      });
    });
  }

  async deleteTeam(id: number) {
    const team = await this.prisma.team.delete({
      where: { id },
    });

    await this.imagesService.deleteImage(team.logoUrl);

    return team;
  }
}
