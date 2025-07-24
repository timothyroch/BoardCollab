import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';
import { TaskIssueModule } from 'src/Issues/task-issue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Tenant, User]), TaskIssueModule,],
  controllers: [TasksController],
  providers: [TasksGateway, TasksService],
  exports: [TasksService, TasksGateway]
})
export class TasksModule {}
