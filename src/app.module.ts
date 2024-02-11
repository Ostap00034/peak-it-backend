import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { BasketModule } from './basket/basket.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    ReviewModule,
    OrderModule,
    BasketModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sdf28(@#&(@#8hB*(@',
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
