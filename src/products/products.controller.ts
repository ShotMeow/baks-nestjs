import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async getProductById(@Param('id') id: Prisma.ProductWhereUniqueInput) {
    return this.productsService.product({ id: Number(id) });
  }

  @Get()
  async getStreams() {
    return this.productsService.products();
  }

  @Post()
  async createProduct(@Body() data: Prisma.ProductCreateInput) {
    return this.productsService.createProduct(data);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: Prisma.ProductWhereUniqueInput,
    @Body() data: Prisma.ProductUpdateInput,
  ) {
    return this.productsService.updateProduct({ id: Number(id) }, data);
  }

  @Delete(':id')
  async deleteStream(@Param('id') id: Prisma.ProductWhereUniqueInput) {
    return this.productsService.deleteProduct({ id: Number(id) });
  }
}
