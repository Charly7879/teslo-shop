import { Module } from '@nestjs/common';
import { MessageWsService } from './messages-ws.service';
import { MessageWsController } from './message-ws.controller';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [MessageWsController],
    providers: [
        MessageWsService,
        MessagesWsGateway, // Importante: Tratar a el Gateway cómo un provider y exportarlo como tal
    ],
    exports: [MessagesWsGateway],
    imports: [AuthModule],
})
export class MessagesWsModule { }
