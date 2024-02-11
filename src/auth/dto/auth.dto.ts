import {
  IsEmail,
  MinLength,
  IsString,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;
  @IsString()
  fio: string;
  @IsPhoneNumber('RU')
  phone: string;
  @MinLength(6, {
    message: 'Пароль должен быть не менее 6 символов.',
  })
  @IsString()
  password: string;
}
