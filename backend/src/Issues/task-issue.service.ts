import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskIssue } from './task-issue.entity';
import { Task } from 'src/tasks/tasks.entity';

@Injectable()
export class TaskIssueService {
  constructor(
    @InjectRepository(TaskIssue)
    private readonly taskIssueRepo: Repository<TaskIssue>,
  ) {}

  async linkIssueToTask(task: Task, issueData: { id: number; title: string; number: number; repo: string; userId: string }) {
    const newLink = this.taskIssueRepo.create({
      task,
      github_issue_title: issueData.title,
      github_issue_number: issueData.number,
      github_repo: issueData.repo,
      user: { id: issueData.userId } as any,
    });
    return this.taskIssueRepo.save(newLink);
  }

  async getIssuesByTask(taskId: string) {
    return this.taskIssueRepo.find({ where: { task: { id: taskId } } });
  }
}
