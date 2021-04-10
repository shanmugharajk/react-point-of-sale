import { NotFoundException } from '@nestjs/common';

export class InvalidIdError extends NotFoundException {
  constructor(message = 'Invalid id.') {
    super({ statusCode: 500, message });
  }
}
