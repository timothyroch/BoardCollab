import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

async createTask(title: string, tenantId: string, creatorId: string, dueDate: any, assigneeEmail: any): Promise<Task> {
  const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
  const creator = await this.userRepo.findOne({ where: { id: creatorId } });

  if (!tenant || !creator) {
    throw new Error('Invalid tenant or creator');
  }

    const assignee = assigneeEmail
    ? await this.userRepo.findOne({ where: { email: assigneeEmail } })
    : null;

  const due = dueDate ? new Date(dueDate) : null;


  const task: Task = this.taskRepository.create({
    title: title,
    tenant: tenant,
    creator: creator,
    assignee: assignee,
    dueDate: due,
  } as Partial<Task>);

  return this.taskRepository.save(task);
}


  async getTasksByTenant(tenantId: string) {
    return this.taskRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['creator', 'assignee'], 
      order: { createdAt: 'DESC' },
    });
  }
}
