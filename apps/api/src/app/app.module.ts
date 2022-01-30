import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MAILER_SERVICE } from './app.constants';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: MAILER_SERVICE,
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: ['localhost:29092'],
                        clientId: 'mailer',
                    },
                    consumer: {
                        groupId: 'mailer-api-consumer',
                    },
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
