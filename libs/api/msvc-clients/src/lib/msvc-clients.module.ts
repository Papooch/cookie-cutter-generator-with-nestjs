import { Module } from '@nestjs/common';
import {
    ClientProviderOptions,
    ClientsModule,
    Transport,
} from '@nestjs/microservices';
import { KAFKA_CLIENT } from './mscv-clients.constants';

const clientKafka: ClientProviderOptions = {
    name: KAFKA_CLIENT,
    transport: Transport.KAFKA,
    options: {
        client: {
            brokers: ['localhost:29092'],
            clientId: 'api',
        },
        consumer: {
            groupId: 'api-consumer',
        },
    },
};

@Module({
    imports: [ClientsModule.register([clientKafka])],
    controllers: [],
    providers: [],
    exports: [ClientsModule],
})
export class MsvcClientsModule {}
