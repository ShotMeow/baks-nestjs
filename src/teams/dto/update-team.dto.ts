import type { MemoryStoredFile } from 'nestjs-form-data';

export class UpdateTeamDto {
  name?: string;
  body?: string;
  winsPercent?: string;
  gamesCount?: string;
  lastMatch?: Date;
  imageFile?: MemoryStoredFile;
  players?: number[];
  tournaments?: number[];
}
