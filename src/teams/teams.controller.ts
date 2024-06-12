import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('/:id')
  async getTeamById(@Param('id') id: Prisma.TeamWhereUniqueInput) {
    return this.teamsService.team({ id: Number(id) });
  }

  @Get()
  async getTeams(
    @Query() query: { search: string; take?: string; sort: 'asc' | 'desc' },
  ) {
    return this.teamsService.teams(query);
  }

  @Post('/create')
  @FormDataRequest()
  async createTeam(
    @Body()
    team: CreateTeamDto,
  ) {
    return this.teamsService.createTeam(team);
  }

  @Patch('/:id/update')
  @FormDataRequest()
  async updateTeam(
    @Param('id') id: Prisma.TeamWhereUniqueInput,
    @Body()
    team: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam({ id: Number(id) }, team);
  }

  @Delete('/:id/delete')
  async deleteTeam(@Param('id') id: Prisma.TeamWhereUniqueInput) {
    return this.teamsService.deleteTeam({ id: Number(id) });
  }
}
