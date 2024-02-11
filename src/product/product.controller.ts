import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(+id);
  }

  @Get('/category/:category')
  async getByCategory(@Param('category') category: string) {
    return this.productService.getByCategory(category)
    }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @UsePipes(new ValidationPipe())
  @Auth()
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: ProductDto,
    @CurrentUser('isAdmin') isAdmin,
  ) {
    if (isAdmin) return this.productService.create(files, dto);
    else throw new BadRequestException('Доступ запрещен');
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @CurrentUser('isAdmin') isAdmin) {
    if (isAdmin) return this.productService.delete(+id);
    else throw new BadRequestException('Доступ запрещен');
  }
}
