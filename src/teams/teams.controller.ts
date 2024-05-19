import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get(':id')
  async getTeamById(@Param('id') id: Prisma.TeamWhereUniqueInput) {
    return this.teamsService.team({ id: Number(id) });
  }

  @Get()
  async getTeams() {
    return this.teamsService.teams();
  }

  @Post()
  async createTeam(@Body() team: Prisma.TeamCreateInput) {
    return this.teamsService.createTeam(team);
  }

  @Patch(':id')
  async updateTeam(
    @Param('id') id: Prisma.TeamWhereUniqueInput,
    @Body() team: Prisma.TeamUpdateInput,
  ) {
    return this.teamsService.updateTeam({ id: Number(id) }, team);
  }

  @Delete(':id')
  async deleteTeam(@Param('id') id: Prisma.TeamWhereUniqueInput) {
    return this.teamsService.deleteTeam({ id: Number(id) });
  }
}
