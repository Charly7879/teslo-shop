import { Module } from '@nestjs/common';
import { MessageWsService } from './messages-ws.service';
import { MessageWsController } from './message-ws.controller';
import { MessagesWsGateway } from './messages-ws.gateway';

@Module({
    controllers: [MessageWsController],
    providers: [
        MessageWsService,
        MessagesWsGateway, // Importante: Tratar a el Gateway cómo un provider y exportarlo como tal
    ],
    exports: [MessagesWsGateway],
})
export class MessagesWsModule { }
