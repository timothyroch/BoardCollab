import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async createTenant(@Body() body: { name: string; userId: string }) {
    return this.tenantsService.createTenant(body.name, body.userId);
  }

  @Get()
  async getTenantsForUser(@Query('userId') userId: string) {
    return this.tenantsService.getTenantsForUser(userId);
  }
}