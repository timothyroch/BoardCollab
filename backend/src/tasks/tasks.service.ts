import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

async createTask(title: string,
   tenantId: string,
    creatorId: string,
    dueDate: any,
    assigneeEmails: string[],
    status: 'to_do' | 'in_progress' | 'done' = 'to_do' 
  ): Promise<Task> {
  const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
  const creator = await this.userRepo.findOne({ where: { id: creatorId } });

  if (!tenant || !creator) {
    throw new Error('Invalid tenant or creator');
  }

    const assignees = await this.userRepo.findBy({
  email: In(assigneeEmails),
});

  const due = dueDate ? new Date(dueDate) : null;


  const task: Task = this.taskRepository.create({
    title,
    tenant,
    creator,
    assignees,
    dueDate: due,
    status,
  } as Partial<Task>);

  return this.taskRepository.save(task);
}


  async getTasksByTenant(tenantId: string) {
    return this.taskRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['creator', 'assignees'], 
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(taskId: string, status: 'to_do' | 'in_progress' | 'done'): Promise<Task> {
  const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['tenant', 'assignees'],  });

  if (!task) {
    throw new Error('Task not found');
  }

  task.status = status;
  return this.taskRepository.save(task);
}

async getTaskById(taskId: string): Promise<Task | null> {
  return this.taskRepository.findOne({
    where: { id: taskId },
    relations: ['creator', 'tenant'],
  });
}

async deleteTask(taskId: string): Promise<void> {
  await this.taskRepository.delete({ id: taskId });
}

}
