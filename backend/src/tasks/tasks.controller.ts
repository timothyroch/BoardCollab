import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('admin-only')
  getAdminData(@Request() req) {
    return { message: `Admin data for ${req.user.email}` };
  }

  @Roles('admin', 'member')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('shared')
  getSharedData(@Request() req) {
    return { message: `Shared data for ${req.user.email}` };
  }

  @Get('public')
  getPublicData() {
    return { message: 'This is a public route.' };
  }


  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(@Query('tenantId') tenantId: string) {
    if (!tenantId) {
      return { error: 'Missing tenantId' };
    }

    return this.tasksService.getTasksByTenant(tenantId);
  }

}
