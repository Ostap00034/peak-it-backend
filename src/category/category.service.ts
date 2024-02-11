import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.category.findMany({});
  }

  async getById(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) throw new NotFoundException('Такой категории не существует');

    return category;
  }

  async getByName(name: string) {
    const category = await this.prisma.category.findUnique({ where: { name } });

    if (!category) throw new NotFoundException('Такой категории не существует');

    return category;
  }

  async create(dto: CategoryDto) {
    const oldCategory = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (oldCategory)
      throw new BadRequestException(
        'Категория с таким наванием уже существует',
      );

    return await this.prisma.category.create({
      data: {
        name: dto.name,
      },
    });
  }

  async update(id: number, dto: CategoryDto) {
    const category = await this.getById(id);

    const oldCategoryByName = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (oldCategoryByName)
      throw new BadRequestException(
        'Категория с таким наванием уже существует',
      );

    return await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }
}
