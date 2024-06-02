import type { MemoryStoredFile } from 'nestjs-form-data';

export class CreatePostDto {
  title: string;
  description: string;
  body: string;
  imageFile: MemoryStoredFile;
  tags: string[];
}
