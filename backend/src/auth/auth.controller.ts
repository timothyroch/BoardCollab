import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @Post('resolve-user')
  async resolveUser(@Body() body: { email: string; name?: string; image?: string }) {
    return this.authService.resolveUser(body);
  }
}
