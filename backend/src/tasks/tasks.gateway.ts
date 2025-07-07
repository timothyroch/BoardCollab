import { 
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TasksGateway {
  @WebSocketServer()
  server: Server;

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
}
