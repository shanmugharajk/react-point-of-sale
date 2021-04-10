import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate({ iat, exp, userId }): Promise<any> {
    const timeDiff = exp - iat;

    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this._authService.getUserByEmailOrId(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
