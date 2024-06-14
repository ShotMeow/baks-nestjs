import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { ImagesService } from '../images/images.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

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
    search = '',
    tag,
    sort = 'desc',
  }: {
    search: string;
    tag: string;
    sort: 'asc' | 'desc';
  }) {
    const tournaments = await this.prisma.tournament.findMany({
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
        createdAt: sort,
      },
    });

    return tournaments.map((tournament) => ({
      ...tournament,
      teams: tournament.teams.map(({ team }) => team),
      tags: tournament.tags.map(({ tag }) => tag),
    }));
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

  async updateTournament(
    where: Prisma.TournamentWhereUniqueInput,
    data: UpdateTournamentDto,
  ) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      const tournament = await this.prisma.tournament.findFirst({
        where,
      });
      await this.imagesService.deleteImage(tournament.artworkUrl);
      delete data.imageFile;
    }

    const currentTags = await this.prisma.tagsOnNews.findMany({
      where: { newsId: where.id },
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
      where: { tournamentId: where.id },
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
      await prisma.tournament.update({
        where,
        data: {
          name: data.name,
          body: data.body,
          description: data.description,
          prize: +data.prize,
          mode: data.mode,
          type: data.type,
          artworkUrl: imagePath,
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

        if (data.teams) {
          const newTeamRelations = data.teams.map((teamId) => ({
            teamId: +teamId,
            tournamentId: where.id,
          }));

          await prisma.teamsOnTournaments.createMany({
            data: newTeamRelations,
          });
        }
      }

      if (tagsChanged) {
        await prisma.tagsOnTournaments.deleteMany({
          where: {
            tournamentId: where.id,
          },
        });

        if (data.tags) {
          const newTagRelations = data.tags.map((tagId) => ({
            tagId: +tagId,
            tournamentId: where.id,
          }));

          await prisma.tagsOnTournaments.createMany({
            data: newTagRelations,
          });
        }
      }
    });
  }

  async deleteTournament(where: Prisma.TournamentWhereUniqueInput) {
    await this.prisma.tagsOnTournaments.deleteMany({
      where: {
        tournamentId: where.id,
      },
    });

    await this.prisma.teamsOnTournaments.deleteMany({
      where: {
        tournamentId: where.id,
      },
    });

    const tournament = await this.prisma.tournament.delete({
      where,
    });

    await this.imagesService.deleteImage(tournament.artworkUrl);

    return tournament;
  }
}
