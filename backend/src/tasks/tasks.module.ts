import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';

@Module({
    controllers: [TasksController],
    providers: [TasksGateway]
})
export class TasksModule {}
