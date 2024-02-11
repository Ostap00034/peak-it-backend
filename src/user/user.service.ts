import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnUserObject } from './return-user.object';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getById(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        ...returnUserObject,
        ...selectObject,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async beAdmin(id: number) {
    const isSameUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isSameUser) throw new NotFoundException('Пользователь не найден');

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isAdmin: true,
      },
    });
  }

  async updateProfile(id: number, email: string, dto: UpdateUserDto) {
    const isSameUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (isSameUser && id !== isSameUser.id) {
      throw new BadRequestException('Email занят');
    }

    const user = await this.getById(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: dto.email,
        fio: dto.fio,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    });
  }
}
