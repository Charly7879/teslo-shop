import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageWsService } from './messages-ws.service';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // WebsocketServer
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
  ) { }

  // Called automatically when a client connects
  handleConnection(client: Socket) {
    //console.log(`Cliente conectado: ${client.id}`);
    this.messageWsService.registerClient(client);
    //console.log(`Conectados: ${this.messageWsService.getConnectedClients()}`);

    /** 
     * Informar a todos los clientes de la nueva conexión.
     * server.emit('nombre_del_event') evento que debe escuchar los clientes.
     */
    this.server.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  // Called automatically when a client disconnects
  handleDisconnect(client: Socket) {
    //console.log(`Cliente desconectado: ${client.id}`);
    this.messageWsService.removeClient(client.id);
    //console.log(`Conectados: ${this.messageWsService.getConnectedClients()}`);
    this.server.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

}
