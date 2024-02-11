import {
  Controller,
  Get,
  HttpCode,
  Put,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.getById(id);
  }

  @Put('/beadmin')
  @Auth()
  async beAdmin(
    @CurrentUser('id') id: number,
    @CurrentUser('isAdmin') isAdmin,
  ) {
    // if (isAdmin)
    return this.userService.beAdmin(id);
  }

  @Get('/:id')
  @Auth()
  async getById(@Param('id') id: string) {
    return this.userService.getById(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async updateProfile(
    @CurrentUser('id') id: number,
    @CurrentUser('email') email: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, email, dto);
  }
}
