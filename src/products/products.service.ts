import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { ImagesService } from '../images/images.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async product(productWhereUniqueInput: Prisma.ProductWhereUniqueInput) {
    return this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
  }

  async products() {
    return this.prisma.product.findMany();
  }

  async createProduct(data: CreateProductDto) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      delete data.imageFile;
    }

    return this.prisma.product.create({
      data: {
        ...data,
        price: +data.price,
        pictureUrl: imagePath,
      },
    });
  }

  async updateProduct(
    where: Prisma.ProductWhereUniqueInput,
    data: UpdateProductDto,
  ) {
    let imagePath: string;
    if (data.imageFile) {
      imagePath = await this.imagesService.uploadImage(data.imageFile);
      const product = await this.prisma.product.findFirst({
        where,
      });
      await this.imagesService.deleteImage(product.pictureUrl);
      delete data.imageFile;
    }

    return this.prisma.product.update({
      where,
      data: {
        ...data,
        price: +data.price,
        pictureUrl: imagePath,
      },
    });
  }

  async deleteProduct(where: Prisma.ProductWhereUniqueInput) {
    const product = await this.prisma.product.delete({
      where,
    });

    await this.imagesService.deleteImage(product.pictureUrl);

    return product;
  }
}
