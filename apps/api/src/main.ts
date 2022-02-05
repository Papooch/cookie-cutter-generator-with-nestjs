import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/api-app.module';
import { setup } from './setup';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [
                    `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
                ],
                clientId: 'api',
            },
            consumer: {
                groupId: 'api-consumer',
            },
            subscribe: {
                fromBeginning: true,
            },
        },
    });
    setup(app);
    app.enableShutdownHooks();
    const port = process.env.PORT || 3333;
    await app.startAllMicroservices();
    await app.listen(port);
    Logger.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
