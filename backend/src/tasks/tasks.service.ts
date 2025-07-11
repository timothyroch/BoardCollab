import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(title: string, tenantId: string): Promise<Task> {
  const task = this.taskRepository.create({
    title,
    tenantId,
  });

  return this.taskRepository.save(task);
}


  async getTasksByTenant(tenantId: string) {
    return this.taskRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }
}
