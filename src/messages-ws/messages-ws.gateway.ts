import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageWsService } from './messages-ws.service';
import { MessagesWsDto } from './dtos/messages-ws.dto';

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

    const token = client.handshake.headers.authentication as string;

    console.log(token)
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

  // Escuchar al cliente
  @SubscribeMessage('message-from-client')
  handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: MessagesWsDto) {

    // Este mensaje es emitido al mismo cliente que lo envía
    /* client.emit('message-from-server', {
      fullName: 'Yo',
      message: data.message,
    }); */

    // Emitir mensaje a todos los clientes menos a quién lo ha enviado
    /* client.broadcast.emit('message-from-server', {
      fullName: 'Yo',
      message: data.message,
    }); */

    // Emitir mensaje a todos incluyendo a quién lo emitió
    this.server.emit('message-from-server', {
      fullName: 'Yo',
      message: data.message,
    });
  }

}
