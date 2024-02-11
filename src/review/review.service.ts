import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { v4 as uuidv4 } from 'uuid';

import * as path from 'path';
import * as fs from 'fs';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async getAll() {
    return this.prisma.review.findMany();
  }

  async getById(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) throw new NotFoundException('Такого отзыва нет');

    return review;
  }

  async create(files: Array<Express.Multer.File>, dto: ReviewDto, id: number) {
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

    const newReview = await this.prisma.review.create({
      data: {
        userId: id,
        images: filenames,
        rating: +dto.rating,
        content: dto.content,
        productId: +dto.productId,
      },
    });

    await this.productService.newReview(+dto.rating, +dto.productId);

    return newReview;
  }
}
