import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // Server instance for broadcasting to all clients
  @WebSocketServer()
  server: Server;

  // Called automatically when a client connects
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  // Called automatically when a client disconnects
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

}
