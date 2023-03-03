import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'enter an email address' })
  @IsEmail({}, { message: 'enter a valid email address' })
  @MaxLength(200, {
    message: 'email address should be at less than 200 characters',
  })
  email: string;

  @IsNotEmpty({ message: 'enter an username' })
  @MaxLength(200, { message: 'username should be at less than 200 characters' })
  name: string;

  @IsNotEmpty({ message: 'enter password' })
  @MinLength(6, { message: 'password should be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'enter confirmation password' })
  @MinLength(6, {
    message: 'password confirmation should be at less than 6 characters',
  })
  passwordConfirmation: string;
}
