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
  async getTeamById(@Param('id') id: string) {
    return this.teamsService.team(+id);
  }

  @Get()
  async getTeams(
    @Query()
    query: {
      page?: string;
      search: string;
      take?: string;
      sort: 'asc' | 'desc';
    },
  ) {
    return this.teamsService.teams({
      ...query,
      page: query.page && +query.page,
      take: query.take && +query.take,
    });
  }

  @Post('/create')
  @FormDataRequest()
  async createTeam(
    @Body()
    team: CreateTeamDto,
  ) {
    return this.teamsService.createTeam(team);
  }

  @Patch('/:id/edit')
  @FormDataRequest()
  async updateTeam(
    @Param('id') id: string,
    @Body()
    team: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam(+id, team);
  }

  @Delete('/:id/delete')
  async deleteTeam(@Param('id') id: string) {
    return this.teamsService.deleteTeam(+id);
  }
}
