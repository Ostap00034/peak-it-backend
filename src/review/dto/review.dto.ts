import { IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  content: string;
  @IsString()
  rating: string;
  @IsString()
  productId: string;
}
