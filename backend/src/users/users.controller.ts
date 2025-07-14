import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('by-tenant')
  async getUsersByTenant(@Query('tenantId') tenantId: string) {
    if (!tenantId) throw new BadRequestException('Missing tenantId');
    return this.usersService.getUsersByTenant(tenantId);
  }
}
