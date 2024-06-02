import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';
import { ImagesModule } from '../images/images.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [ProductsController],
  imports: [PrismaModule, ImagesModule, NestjsFormDataModule],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
