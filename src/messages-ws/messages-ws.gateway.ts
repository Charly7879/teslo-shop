import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageWsService } from './messages-ws.service';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly messageWsService: MessageWsService,
  ) { }

  // Server instance for broadcasting to all clients
  @WebSocketServer()
  server: Server;

  // Called automatically when a client connects
  handleConnection(client: Socket) {
    //console.log(`Cliente conectado: ${client.id}`);
    this.messageWsService.registerClient(client);

    console.log(`Conectados: ${this.messageWsService.getConnectedClients()}`);
  }

  // Called automatically when a client disconnects
  handleDisconnect(client: Socket) {
    //console.log(`Cliente desconectado: ${client.id}`);
    this.messageWsService.removeClient(client.id);
    console.log(`Conectados: ${this.messageWsService.getConnectedClients()}`);
  }

}
