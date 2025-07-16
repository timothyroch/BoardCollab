import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { User } from '../auth/user.entity';
import { Task } from '../tasks/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Task])],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
