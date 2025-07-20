import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { TasksService } from '../tasks/tasks.service';
import { TasksGateway } from '../tasks/tasks.gateway';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,    
    private readonly tasksService: TasksService,
    private readonly tasksGateway: TasksGateway,
  
  ) {}

  @Post()
  async create(
    @Body() body: { content: string; taskId: string; userId: string }
  ): Promise<Comment> {
  const comment = await this.commentsService.create(body);
  const task = await this.tasksService.getTaskById(body.taskId);

  if (!task || !task.tenant?.id) {
    throw new Error('Associated task or tenant not found');
  }

  this.tasksGateway.server.to(task.tenant.id).emit('commentAdded', {
    ...comment,
    taskId: body.taskId,
    tenantId: task.tenant.id,

  });

  return comment;
  }

  @Get()
  async getByTask(@Query('taskId') taskId: string): Promise<Comment[]> {
    return this.commentsService.findByTaskId(taskId);
  }
}
