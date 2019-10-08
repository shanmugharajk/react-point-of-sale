import { Get, Controller } from 'routing-controllers';

@Controller()
export class AuthController {
  @Get('/')
  public async login() {
    return 'Welcome to react-point-of-sale api';
  }
}
