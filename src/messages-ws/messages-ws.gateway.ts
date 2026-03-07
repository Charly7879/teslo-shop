import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageWsService } from './messages-ws.service';
import { MessagesWsDto } from './dtos/messages-ws.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';

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
    private readonly jwtService: JwtService,
  ) { }

  // Called automatically when a client connects
  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    /** 
     * Informar a todos los clientes de la nueva conexión.
     * server.emit('nombre_del_event') evento que debe escuchar los clientes.
     */
    this.server.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  // Called automatically when a client disconnects
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
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
      fullName: this.messageWsService.getUserFullName(client.id),
      message: data.message,
    });
  }

}
