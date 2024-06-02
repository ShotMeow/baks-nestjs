import type { MemoryStoredFile } from 'nestjs-form-data';

export class UpdateStreamDto {
  title?: string;
  description?: string;
  channel?: string;
  imageFile?: MemoryStoredFile;
}
