import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Task])],
    controllers: [TasksController],
    providers: [TasksGateway, TasksService],
    exports: [TasksService] 
})
export class TasksModule {}
