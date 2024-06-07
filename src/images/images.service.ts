import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import type { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class ImagesService {
  async uploadImage(file: MemoryStoredFile): Promise<string> {
    try {
      const imageName = `${uuidv4()}-${file.originalName}`;

      const imagePath = `storage/images/${imageName}`;

      if (!fs.existsSync('storage/images')) {
        fs.mkdirSync('storage/images', { recursive: true });
      }

      fs.writeFileSync(imagePath, file.buffer);

      return imageName;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      fs.rmSync(`storage/images/${imagePath}`);
    } catch (error) {
      console.error(error);
    }
  }
}
