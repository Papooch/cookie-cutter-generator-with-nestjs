import { Module } from '@nestjs/common';
import { KafkaClientCoreModule } from '@project/shared-kafka-client-core';

@Module({
    imports: [
        KafkaClientCoreModule.registerAsync({
            useFactory: () => ({
                brokerUri: `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
                clientId: 'api',
            }),
        }),
    ],
    exports: [KafkaClientCoreModule],
})
export class ApiKafkaClientModule {}
