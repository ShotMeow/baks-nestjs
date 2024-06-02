import type { MemoryStoredFile } from 'nestjs-form-data';

export class CreateStreamDto {
  title: string;
  description: string;
  channel: string;
  imageFile: MemoryStoredFile;
}
