import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async tournament(tagWhereUniqueInput: Prisma.TournamentWhereUniqueInput) {
    const tournament = await this.prisma.tournament.findUnique({
      where: tagWhereUniqueInput,
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
      },
    });

    return {
      ...tournament,
      teams: tournament.teams?.map(({ team }) => team),
    };
  }

  async tournaments() {
    const tournaments = await this.prisma.tournament.findMany({
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
      },
    });

    return tournaments.map((tournament) => ({
      ...tournament,
      teams: tournament.teams.map(({ team }) => team),
    }));
  }

  async createTournament(
    data: Prisma.TournamentCreateInput & { teams: number[] },
  ) {
    return this.prisma.tournament.create({
      data: {
        ...data,
        prize: +data.prize,
        teams: {
          create: data.teams?.map((teamId) => ({
            team: {
              connect: {
                id: teamId,
              },
            },
          })),
        },
      },
    });
  }

  async updateTournament(
    where: Prisma.TournamentWhereUniqueInput,
    data: Prisma.TournamentUpdateInput & { teams: number[] },
  ) {
    const currentTeams = await this.prisma.teamsOnTournaments.findMany({
      where: { tournamentId: where.id },
      select: {
        teamId: true,
      },
    });

    const currentTeamIds = currentTeams.map((team) => team.teamId);

    const teamsChanged =
      JSON.stringify(currentTeamIds.sort()) !==
      JSON.stringify(data.teams.sort());

    return this.prisma.$transaction(async (prisma) => {
      await prisma.tournament.update({
        where,
        data: {
          name: data.name,
          body: data.body,
          description: data.description,
          prize: data.prize,
          mode: data.mode,
          type: data.type,
          artworkUrl: data.artworkUrl,
          address: data.address,
          eventDate: data.eventDate,
        },
      });

      if (teamsChanged) {
        await prisma.teamsOnTournaments.deleteMany({
          where: {
            tournamentId: where.id,
          },
        });

        const newTeamRelations = data.teams.map((teamId) => ({
          teamId,
          tournamentId: where.id,
        }));
        await prisma.teamsOnTournaments.createMany({
          data: newTeamRelations,
        });
      }
    });
  }

  async deleteTournament(where: Prisma.TournamentWhereUniqueInput) {
    return this.prisma.tournament.delete({
      where,
    });
  }
}
