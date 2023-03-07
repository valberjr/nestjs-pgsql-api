import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/users/user-role';

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'enter a valid user',
  })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'enter a valid email address' })
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;
}
