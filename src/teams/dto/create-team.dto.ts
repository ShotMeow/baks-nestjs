import type { MemoryStoredFile } from 'nestjs-form-data';

export class CreateTeamDto {
  name: string;
  body: string;
  winsPercent?: number;
  gamesCount?: number;
  lastMatch?: Date;
  imageFile?: MemoryStoredFile;
  players?: string[];
  tournaments?: string[];
}
