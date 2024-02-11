import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';
import { CategoryService } from 'src/category/category.service';
import { v4 as uuidv4 } from 'uuid';

import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async getAll() {
    return await this.prisma.product.findMany();
  }

  async getById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) throw new NotFoundException('Такой продукт не найден');

    return product;
  }

  async getByCategory(category: string) {
    const category1 = await this.categoryService.getByName(category);

    return await this.prisma.product.findMany({
      where: {
        categoryId: category1.id,
      },
    });
  }

  async newReview(rating: number, productId: number) {
    const product = await this.getById(productId);

    const total_rating =
      (product.total_rating + rating) / (product.reviews_amount + 1);

    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        rating: total_rating,
        reviews_amount: product.reviews_amount + 1,
        total_rating: product.total_rating + rating,
      },
    });
  }

  async create(files: Array<Express.Multer.File>, dto: ProductDto) {
    const productByName = await this.prisma.product.findUnique({
      where: { name: dto.name },
    });

    if (productByName)
      throw new BadRequestException('Продукт с таким названием уже существует');

    const filenames = [];
    const fileUploadPromises = files.map((file) => {
      const fileExtension = path.extname(file.originalname);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;

      const filePath = path.join(
        __dirname,
        '../../',
        'uploads',
        uniqueFilename,
      );

      filenames.push(uniqueFilename);

      return fs.promises.writeFile(filePath, file.buffer);
    });

    await Promise.all(fileUploadPromises);

    const category = await this.categoryService.getByName(dto.category);

    return await this.prisma.product.create({
      data: {
        name: dto.name,
        price: +dto.price,
        description: dto.description,
        categoryId: category.id,
        images: filenames,
      },
    });
  }

  async delete(id: number) {
    const product = await this.getById(id);

    return await this.prisma.product.delete({ where: { id } });
  }
}
