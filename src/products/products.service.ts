import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async product(productWhereUniqueInput: Prisma.ProductWhereUniqueInput) {
    return this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
  }

  async products() {
    return this.prisma.product.findMany();
  }

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
    });
  }

  async updateProduct(
    where: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput,
  ) {
    return this.prisma.product.update({
      where,
      data,
    });
  }

  async deleteProduct(where: Prisma.ProductWhereUniqueInput) {
    return this.prisma.product.delete({
      where,
    });
  }
}
