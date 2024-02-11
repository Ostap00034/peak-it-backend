import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, CategoryService],
  imports: [CategoryModule],
  exports: [ProductService],
})
export class ProductModule {}
