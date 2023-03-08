import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({
    message: 'enter a valid password',
  })
  @MinLength(6, {
    message: 'password must be at least 6 characters',
  })
  @MaxLength(32, {
    message: 'password cannot be longer than 32 characters',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password should contains at least an upper case letter, a lower case letter, a number or a symbol',
  })
  password: string;

  @IsString({
    message: 'enter a valid password',
  })
  @MinLength(6, {
    message: 'password must be at least 6',
  })
  @MaxLength(32, {
    message: 'password cannot be longer than 32 characters',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password should contains at least an upper case letter, a lower case letter, a number or a symbolA senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número ou um símbulo',
  })
  passwordConfirmation: string;
}
