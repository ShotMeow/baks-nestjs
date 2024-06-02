import type { MemoryStoredFile } from 'nestjs-form-data';

export class UpdateUserDto {
  email?: string;
  password?: string;
  nickname?: string;
  name?: string;
  pictureUrl?: string;
  role?: string;
  killDeaths?: number;
  deaths?: number;
  assists?: number;
  imageFile?: MemoryStoredFile;
}
