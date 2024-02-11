import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ProductService, CategoryService],
  imports: [ProductModule],
})
export class ReviewModule {}
