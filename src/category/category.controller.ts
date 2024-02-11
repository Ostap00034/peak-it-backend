import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.categoryService.getById(+id);
  }

  @Get('/name/:name')
  async getByName(@Param('name') name: string) {
    return this.categoryService.getByName(name);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @Auth()
  async create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Put('/:id')
  @Auth()
  async update(@Param('id') id: string, @Body() dto: CategoryDto) {
    return this.categoryService.update(+id, dto);
  }
}
