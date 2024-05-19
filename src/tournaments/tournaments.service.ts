import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async tournament(tagWhereUniqueInput: Prisma.TournamentWhereUniqueInput) {
    return this.prisma.tournament.findUnique({
      where: tagWhereUniqueInput,
    });
  }

  async tournaments() {
    return this.prisma.tournament.findMany();
  }

  async createTournament(data: Prisma.TournamentCreateInput) {
    return this.prisma.tournament.create({
      data: {
        ...data,
        prize: +data.prize,
      },
    });
  }

  async updateTournament(
    where: Prisma.TournamentWhereUniqueInput,
    data: Prisma.TournamentUpdateInput,
  ) {
    return this.prisma.tournament.update({
      where,
      data,
    });
  }

  async deleteTournament(where: Prisma.TournamentWhereUniqueInput) {
    return this.prisma.tournament.delete({
      where,
    });
  }
}
