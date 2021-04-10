import { HttpException, HttpStatus } from '@nestjs/common';

export class GenericError extends HttpException {
  constructor(message = 'Invalid id.') {
    super(
      { message, statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
