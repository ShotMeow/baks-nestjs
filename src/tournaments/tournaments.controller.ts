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
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get(':id')
  async getTournamentById(@Param('id') id: Prisma.TournamentWhereUniqueInput) {
    return this.tournamentsService.tournament({ id: Number(id) });
  }

  @Get()
  async getTournaments() {
    return this.tournamentsService.tournaments();
  }

  @Post()
  async createTournament(@Body() tournament: Prisma.TournamentCreateInput) {
    return this.tournamentsService.createTournament(tournament);
  }

  @Patch(':id')
  async updateTournament(
    @Param('id') id: Prisma.TournamentWhereUniqueInput,
    @Body() tournament: Prisma.TeamUpdateInput,
  ) {
    return this.tournamentsService.updateTournament(
      { id: Number(id) },
      tournament,
    );
  }

  @Delete(':id')
  async deleteTournament(@Param('id') id: Prisma.TournamentWhereUniqueInput) {
    return this.tournamentsService.deleteTournament({ id: Number(id) });
  }
}
