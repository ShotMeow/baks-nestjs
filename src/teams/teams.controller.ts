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
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FormDataRequest } from 'nestjs-form-data';

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
  @FormDataRequest()
  async createTeam(
    @Body()
    team: CreateTeamDto,
  ) {
    return this.teamsService.createTeam(team);
  }

  @Patch(':id')
  @FormDataRequest()
  async updateTeam(
    @Param('id') id: Prisma.TeamWhereUniqueInput,
    @Body()
    team: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam({ id: Number(id) }, team);
  }

  @Delete(':id')
  async deleteTeam(@Param('id') id: Prisma.TeamWhereUniqueInput) {
    return this.teamsService.deleteTeam({ id: Number(id) });
  }
}
