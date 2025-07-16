import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() body: { content: string; taskId: string; userId: string }
  ): Promise<Comment> {
    return this.commentsService.create(body);
  }

  @Get()
  async getByTask(@Query('taskId') taskId: string): Promise<Comment[]> {
    return this.commentsService.findByTaskId(taskId);
  }
}
