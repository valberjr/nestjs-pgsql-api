import { Injectable } from '@nestjs/common';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/users/user-role';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('not the same password');
    }
    return await this.userRepository.createUser(createUserDto, UserRole.USER);
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
}
