import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskIssue } from './task-issue.entity';
import { TaskIssueService } from './task-issue.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskIssue])],
  providers: [TaskIssueService],
  exports: [TypeOrmModule, TaskIssueService],
})
export class TaskIssueModule {}
