import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserLogin } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() userLoginDto: UserLogin) {
    const user = await this._authService.validateUser(userLoginDto);
    return await this._authService.createToken(user);
  }
}
