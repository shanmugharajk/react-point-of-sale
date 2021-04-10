import { ILoginResponse, IUserLogin } from '@pos/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLogin implements IUserLogin {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class LoginResponse implements ILoginResponse {
  readonly token: string;

  readonly expiresIn: number;

  constructor(data: { token: string; expiresIn: number }) {
    this.token = data.token;
    this.expiresIn = data.expiresIn;
  }
}
