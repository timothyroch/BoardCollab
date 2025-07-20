import { Controller, Get, UseGuards, Request, Query, Post, Body, BadRequestException, Delete, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TasksService } from './tasks.service';
import { TasksGateway } from './tasks.gateway';
import { Param, Patch } from '@nestjs/common';

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


  constructor(private readonly tasksService: TasksService
, private readonly tasksGateway: TasksGateway
  ) {
    console.log('>>> TasksController loaded');
  }

  @Get()
  async getTasks(@Query('tenantId') tenantId: string) {
    if (!tenantId) {
      return { error: 'Missing tenantId' };
    }

    return this.tasksService.getTasksByTenant(tenantId);
  }

@Post()
async createTask(@Body() body: any) {
  const { title, tenantId, creatorId, dueDate, assigneeEmails, status } = body;
  if (!title || !tenantId || !creatorId || !Array.isArray(assigneeEmails) || assigneeEmails.length === 0) {
    throw new BadRequestException('Missing required fields');
  }
  const task = await this.tasksService.createTask(
    title,
    tenantId,
    creatorId,
    dueDate,
    assigneeEmails,
    status,
  );
  this.tasksGateway.server
    .to(tenantId)
    .emit('taskCreated', { ...task, tenantId });
  return task;
}

@Patch(':id/status')
async updateTaskStatus(
  @Param('id') taskId: string,
  @Body('status') status: 'to_do' | 'in_progress' | 'done',
) {
  if (!status || !['to_do', 'in_progress', 'done'].includes(status)) {
    throw new BadRequestException('Invalid status value');
  }

  const updatedTask = await this.tasksService.updateStatus(taskId, status);

this.tasksGateway.server.to(updatedTask.tenant.id).emit('taskUpdated', {
  ...updatedTask,
  tenantId: updatedTask.tenant.id,
});

return updatedTask;

}
@Roles('admin', 'member')
@Delete(':id')
async deleteTask(@Param('id') taskId: string) {
  const task = await this.tasksService.getTaskById(taskId);
  if (!task) {
    throw new NotFoundException('Task not found');
  }

  await this.tasksService.deleteTask(taskId);

  this.tasksGateway.server.to(task.tenant.id).emit('taskDeleted', taskId);

  return { message: 'Task deleted successfully' };
}



}
