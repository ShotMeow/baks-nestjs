import type { MemoryStoredFile } from 'nestjs-form-data';

export class UpdateProductDto {
  name?: string;
  price?: number;
  imageFile?: MemoryStoredFile;
}
