import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../auth/user.entity';
import { Task } from '../tasks/tasks.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(commentData: {
    content: string;
    taskId: string;
    userId: string;
  }): Promise<Comment> {
    const { content, taskId, userId } = commentData;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error('Task not found');
    }

    const comment = this.commentRepository.create({
      content,
      user,
      task,
    });

    return this.commentRepository.save(comment);
  }

  async findByTaskId(taskId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });
  }
}
