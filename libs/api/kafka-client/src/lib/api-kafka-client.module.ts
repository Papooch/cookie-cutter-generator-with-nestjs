import { Module } from '@nestjs/common';
import { KafkaClientCoreModule } from '@project/shared-kafka-client-core';

@Module({
    imports: [
        KafkaClientCoreModule.registerAsync({
            useFactory: () => ({
                brokerUri: 'localhost:29092',
                clientId: 'api',
            }),
        }),
    ],
    exports: [KafkaClientCoreModule],
})
export class ApiKafkaClientModule {}
