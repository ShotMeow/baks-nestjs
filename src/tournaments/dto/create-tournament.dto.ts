import type { MemoryStoredFile } from 'nestjs-form-data';

export class CreateTournamentDto {
  name: string;
  body: string;
  description: string;
  prize: number;
  mode: string;
  type: string;
  address: string;
  eventDate: Date;
  imageFile: MemoryStoredFile;
  teams: string[];
}
