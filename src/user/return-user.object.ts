import { Prisma } from '@prisma/client';

export const returnUserObject: Prisma.UserSelect = {
  id: true,
  email: true,
  fio: true,
  phone: true,
  password: false,
  favorites: true,
  order: true,
  isAdmin: true,
};
