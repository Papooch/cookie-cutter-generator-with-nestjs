import { Module } from '@nestjs/common';
import { KafkaClientCoreModule } from '@project/shared-kafka-client-core';
import { convert } from './convert';
import { CONVERT } from './converter-app.constants';
import { ConverterAppController } from './converter-app.controller';
import { ConverterAppService } from './converter-app.service';

@Module({
    imports: [
        KafkaClientCoreModule.register({
            brokerUri: `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
            clientId: 'converter',
        }),
    ],
    controllers: [ConverterAppController],
    providers: [
        {
            provide: CONVERT,
            useValue: convert,
        },
        ConverterAppService,
    ],
})
export class ConverterAppModule {}
