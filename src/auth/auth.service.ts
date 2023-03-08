import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable } from '@nestjs/common';
import {
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { randomBytes } from 'crypto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/users/user-role';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('not the same password');
    }

    const user = await this.userRepository.createUser(
      createUserDto,
      UserRole.USER,
    );

    const mail = {
      to: user.email,
      from: 'noreply@email.com',
      subject: 'Email confirmation',
      template: 'email-confirmation',
      context: {
        token: user.confirmationToken,
      },
    };

    await this.mailerService.sendMail(mail);

    return user;
  }

  async signin(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentialsDto);
    if (user == null) {
      throw new UnauthorizedException('invalid credentials');
    }

    const jwtPayload = { id: user.id };
    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }

  async confirmEmail(confirmationToken: string): Promise<void> {
    const result = await this.userRepository.update(
      { confirmationToken },
      { confirmationToken: null },
    );
    if (result.affected === 0) {
      throw new NotFoundException('Invalid token');
    }
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('user not found with this email');
    }

    user.recoverToken = randomBytes(32).toString('hex');
    await user.save();

    const mail = {
      to: user.email,
      from: 'noreply@email.com',
      subject: 'password recovery',
      context: {
        token: user.recoverToken,
      },
    };

    await this.mailerService.sendMail(mail);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { password, passwordConfirmation } = changePasswordDto;

    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException('not the same password');
    }

    await this.userRepository.changePassword(id, password);
  }

  async resetPassword(
    recoverToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        recoverToken: recoverToken,
      },
      select: ['id'],
    });

    if (!user) {
      throw new NotFoundException('invalid token');
    }

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (error) {
      throw error;
    }
  }
}
