import { Controller } from '@nestjs/common';
import {
  Body,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/users/user-role';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.signup(createUserDto);
    return {
      message: 'user created successfully',
    };
  }

  @Post('/signin')
  async signin(
    @Body(ValidationPipe) credentialsDto: CredentialsDto,
  ): Promise<{ token: string }> {
    return await this.authService.signin(credentialsDto);
  }

  @Patch(':token')
  async confirmEmail(@Param('token') token: string) {
    const user = await this.authService.confirmEmail(token);
    return {
      message: 'email confirmed',
    };
  }

  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.sendRecoverPasswordEmail(email);
    return {
      message: 'email sent with instructions to reset your password',
    };
  }

  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, changePasswordDto);
    return {
      message: 'password redefined successfully',
    };
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard())
  async changePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ) {
    if (user.role !== UserRole.ADMIN && user.id.toString() !== id) {
      throw new UnauthorizedException(
        'user without permission to accomplish this operation',
      );
    }

    await this.authService.changePassword(id, changePasswordDto);
    return {
      message: 'password changed',
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
