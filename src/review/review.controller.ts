import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReviewDto } from './dto/review.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.reviewService.getById(+id);
  }

  @UseInterceptors(FilesInterceptor('images', 5))
  @UsePipes(new ValidationPipe())
  @Post()
  @Auth()
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: ReviewDto,
    @CurrentUser('id') id: number,
  ) {
    return this.reviewService.create(files, dto, id);
  }
}
