import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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
}
