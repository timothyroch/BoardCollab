import { 
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from './tasks.service'; 
import { Injectable } from '@nestjs/common'; 

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tasksService: TasksService) {} 

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinTenant')
  handleJoinTenant(@MessageBody() tenantId: string, @ConnectedSocket() client: Socket): void {
    client.join(tenantId);
    console.log(`Client ${client.id} joined tenant ${tenantId}`);
  }

  @SubscribeMessage('updateTask')
  handleUpdateTask(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    const { tenantId, task } = data;
    this.server.to(tenantId).emit('taskUpdated', task);
    console.log(`Task updated for tenant ${tenantId}:`, task); 
  }

  @SubscribeMessage('createTask')
  async handleCreateTask(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
    const { tenantId, task } = data;

    if (!tenantId || !task?.title) return;

    const savedTask = await this.tasksService.createTask(task.title, tenantId, task.creatorId);

    this.server.to(tenantId).emit('taskCreated', {
  ...savedTask,
  tenantId,
});

    console.log(`Task created for tenant ${tenantId}:`, savedTask);
  }
}
