import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';
import { TaskIssue } from 'src/Issues/task-issue.entity';
import { TaskMailer } from 'src/mailer/task-mailer.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(TaskIssue)
    private readonly taskIssueRepo: Repository<TaskIssue>,
  ) {}

async createTask(title: string,
   tenantId: string,
    creatorId: string,
    dueDate: any,
    assigneeEmails: string[],
    status: 'to_do' | 'in_progress' | 'done' = 'to_do',
    issues: { repo: string; issueNumber: number; issueTitle: string }[] = []
  ): Promise<Task> {
  const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
  const creator = await this.userRepo.findOne({ where: { id: creatorId } });

  if (!tenant || !creator) {
    throw new Error('Invalid tenant or creator');
  }

    const assignees = await this.userRepo.findBy({
  email: In(assigneeEmails),
});

  const due = dueDate ? new Date(dueDate) : undefined;


  const task = this.taskRepository.create({
    title,
    tenant,
    creator,
    assignees,
    dueDate: due,
    status,
  });
  const savedTask = await this.taskRepository.save(task);
if (issues.length > 0) {
  const taskIssues = issues.map(issue => this.taskIssueRepo.create({
    task: savedTask,
    github_issue_number: issue.issueNumber,
    github_issue_title: issue.issueTitle,
    github_repo: issue.repo,
  }));
  await this.taskIssueRepo.save(taskIssues);
}
const fullTask = await this.taskRepository.findOne({
  where: { id: savedTask.id },
  relations: ['creator', 'assignees', 'issues'],
});

if (!fullTask) throw new Error('Failed to reload task');
const assignerName = creator.name || creator.email;
const groupName = tenant.name;
const taskLink = `${process.env.FRONTEND_URL}/task/${savedTask.id}`;

setImmediate(() => {
  Promise.all(
    assignees.map((assignee) =>
      TaskMailer.sendTaskAssignmentEmail(
        assignee.email,
        title,
        groupName,
        assignerName,
        taskLink,
        issues
      )
    )
  ).catch(err => console.error('Email sending failed:', err));
});



return fullTask;

  }

  async getTasksByTenant(tenantId: string) {
    return this.taskRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['creator', 'assignees', 'issues'], 
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(taskId: string, status: 'to_do' | 'in_progress' | 'done'): Promise<Task> {
  const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['tenant', 'assignees'],  });

  if (!task) {
    throw new Error('Task not found');
  }

  task.status = status;
  await this.taskRepository.save(task);
    const fullTask = await this.taskRepository.findOne({
    where: { id: taskId },
    relations: ['creator', 'assignees', 'tenant', 'issues'],
  });

  if (!fullTask) {
    throw new Error('Failed to reload updated task');
  }

  return fullTask;
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
