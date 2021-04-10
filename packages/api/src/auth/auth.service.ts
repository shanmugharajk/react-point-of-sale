import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';

import {
  UserNotFoundException,
  UserPasswordNotValidException,
} from '@pos-api/exceptions';
import { HashingService } from '@pos-api/utils';

import { LoginResponse, UserLogin } from './dtos';
import { UsersEntity } from './users.entity';

@Injectable()
export class AuthService {
  constructor(
    protected readonly _entityManager: EntityManager,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  async createToken(user: UsersEntity): Promise<LoginResponse> {
    const { userId: userId, userName, role } = user;

    const expiresIn = this._configService.get('JWT_EXPIRATION_TIME');
    return new LoginResponse({
      token: await this._jwtService.signAsync({ userId, userName, role }),
      expiresIn,
    });
  }

  async validateUser(userLoginDto: UserLogin) {
    const user = await this.getUserByEmailOrId(userLoginDto.userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await HashingService.validateHash(
      userLoginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UserPasswordNotValidException();
    }

    return user;
  }

  async getUserByEmailOrId(idOrEmail: string) {
    return await this._entityManager.findOne(UsersEntity, {
      where: [{ userId: idOrEmail }, { email: idOrEmail }],
    });
  }
}
