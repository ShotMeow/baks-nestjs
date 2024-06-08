import type { MemoryStoredFile } from 'nestjs-form-data';

export class UpdateTournamentDto {
  name?: string;
  body?: string;
  description?: string;
  prize?: string;
  mode?: string;
  type?: string;
  address?: string;
  eventDate?: Date;
  imageFile?: MemoryStoredFile;
  teams?: string[];
  tags?: string[];
}
