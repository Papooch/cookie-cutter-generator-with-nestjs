import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConverterAppModule } from './app/converter-app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        ConverterAppModule,
        {
            transport: Transport.KAFKA,
            options: {
                client: {
                    brokers: [
                        `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
                    ],
                    clientId: 'converter',
                },
                consumer: {
                    groupId: 'converter-consumer',
                },
                subscribe: {
                    fromBeginning: true,
                },
            },
        }
    );
    app.enableShutdownHooks();
    await app.listen();
    Logger.log(`Application is running`);
}

void bootstrap();
