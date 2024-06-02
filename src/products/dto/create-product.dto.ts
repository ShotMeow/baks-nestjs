import type { MemoryStoredFile } from 'nestjs-form-data';

export class CreateProductDto {
  name: string;
  price: number;
  imageFile: MemoryStoredFile;
}
