import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super-secret',
    });
  }

  async validate(payload: { id: string }) {
    const { id } = payload;
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: ['name', 'email', 'status', 'role', 'id'],
    });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return user;
  }
}
