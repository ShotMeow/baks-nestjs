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

  async products({
    page = 1,
    search = '',
    take = 12,
  }: {
    page?: number;
    search: string;
    take?: number;
  }) {
    const totalProductsCount = await this.prisma.product.count({
      where: {
        name: {
          contains: search,
        },
      },
    });

    const skip = take && (page - 1) * take;

    const products = await this.prisma.product.findMany({
      take: !search ? take : undefined,
      skip: !search ? skip : undefined,
      where: {
        name: {
          contains: search,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const pagesCount = Math.ceil(totalProductsCount / take);
    const visiblePages = 5;

    const pagination = {
      currentPage: page,
      lastPage: pagesCount,
      pages: Array.from(
        { length: pagesCount > visiblePages ? visiblePages : pagesCount },
        (_, k) => {
          let startPage = 1;

          if (pagesCount > visiblePages && page > Math.ceil(visiblePages / 2)) {
            startPage = Math.min(
              pagesCount - visiblePages + 1,
              Math.max(1, page - Math.floor(visiblePages / 2)),
            );
          }

          return startPage + k;
        },
      ).filter((p) => p >= 1 && p <= pagesCount),
      itemsCount: totalProductsCount,
    };

    return {
      data: products,
      pagination,
    };
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
