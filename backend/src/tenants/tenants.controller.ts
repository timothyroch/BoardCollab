import { Body, Controller, Post, Get, Query, Delete, Param } from '@nestjs/common';
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
   @Delete(':tenantId/users/:userId')
  async removeUserFromTenant(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
  ) {
    await this.tenantsService.removeUserFromTenant(userId, tenantId);
    return { message: 'User removed from tenant' };
  }

  @Get(':tenantId')
async getTenantById(@Param('tenantId') tenantId: string) {
  const tenant = await this.tenantsService.getTenantById(tenantId);
  if (!tenant) {
    return { message: 'Tenant not found' }; 
  }
  return tenant;
}

}