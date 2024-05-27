import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [ProductsController],
  imports: [PrismaModule],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
