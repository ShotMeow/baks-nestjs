import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('images')
export class ImagesController {
  @Get(':imageName')
  getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = `storage/images/${imageName}`;

    res.setHeader('Content-Type', 'image/jpeg');

    if (fs.existsSync(imagePath)) {
      fs.createReadStream(imagePath).pipe(res);
    } else {
      res.status(404).send('Изображение не найдено');
    }
  }
}
