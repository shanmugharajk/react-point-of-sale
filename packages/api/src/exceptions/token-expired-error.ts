import { UnauthorizedException } from '@nestjs/common';

export class TokenExpiredError extends UnauthorizedException {
  constructor() {
    super({ statusCode: 401, message: 'Unauthorized: Token expired.' });
  }
}
