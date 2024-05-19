import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async team(teamWhereUniqueInput: Prisma.TeamWhereUniqueInput) {
    return this.prisma.team.findUnique({
      where: teamWhereUniqueInput,
    });
  }

  async teams() {
    return this.prisma.team.findMany();
  }

  async createTeam(data: Prisma.TeamCreateInput) {
    return this.prisma.team.create({
      data,
    });
  }

  async updateTeam(
    where: Prisma.TeamWhereUniqueInput,
    data: Prisma.TeamUpdateInput,
  ) {
    return this.prisma.team.update({
      where,
      data,
    });
  }

  async deleteTeam(where: Prisma.TeamWhereUniqueInput) {
    return this.prisma.team.delete({
      where,
    });
  }
}
