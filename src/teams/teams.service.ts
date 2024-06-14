import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateTeamDto } from './dto/create-team.dto';
import { ImagesService } from '../images/images.service';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async team(teamWhereUniqueInput: Prisma.TeamWhereUniqueInput) {
    const team = await this.prisma.team.findUnique({
      where: teamWhereUniqueInput,
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
    search = '',
    take,
    sort = 'desc',
  }: {
    search: string;
    take?: string;
    sort: 'asc' | 'desc';
  }) {
    const teams = await this.prisma.team.findMany({
      take: take && +take,
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

    return teams.map((team) => ({
      ...team,
      tournaments: team.tournaments.map(({ tournament }) => tournament),
    }));
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

  async updateTeam(where: Prisma.TeamWhereUniqueInput, data: UpdateTeamDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      const team = await this.prisma.team.findFirst({
        where,
      });
      await this.imagesService.deleteImage(team.logoUrl);
      delete data.imageFile;
    }

    const users = await this.prisma.user.findMany();
    users?.map(async (user) => {
      if (!data.players?.includes(String(user.id))) {
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            teamId: null,
          },
        });
      } else {
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            teamId: where.id,
          },
        });
      }
    });

    const currentTournaments = await this.prisma.teamsOnTournaments.findMany({
      where: { teamId: where.id },
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
      await prisma.team.update({
        where,
        data: {
          name: data.name,
          body: data.body,
          winsPercent: +data.winsPercent,
          gamesCount: +data.gamesCount,
          lastMatch: data.lastMatch,
          logoUrl: imagePath,
        },
      });

      if (tournamentsChanged) {
        await prisma.teamsOnTournaments.deleteMany({
          where: {
            teamId: where.id,
          },
        });

        if (data.tournaments) {
          const newTournamentsRelations = data.tournaments.map(
            (tournamentId) => ({
              tournamentId: +tournamentId,
              teamId: where.id,
            }),
          );

          await prisma.teamsOnTournaments.createMany({
            data: newTournamentsRelations,
          });
        }
      }
    });
  }

  async deleteTeam(where: Prisma.TeamWhereUniqueInput) {
    const team = await this.prisma.team.delete({
      where,
    });

    await this.imagesService.deleteImage(team.logoUrl);

    return team;
  }
}
