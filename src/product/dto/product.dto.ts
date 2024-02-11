import { IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;
  @IsString()
  price: number;
  @IsString()
  category: string;
  @IsString()
  description: string;
}
