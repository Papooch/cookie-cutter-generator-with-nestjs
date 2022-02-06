import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '@project/shared-kafka-client-core';

import { ConverterAppService } from './converter-app.service';

@Controller()
export class ConverterAppController {
    private logger = new Logger(ConverterAppController.name);

    constructor(
        @Inject(KAFKA_CLIENT) private readonly kafka: ClientKafka,
        private readonly appService: ConverterAppService
    ) {}

    @EventPattern('cookie-cutters.uploaded')
    async convert(
        @Payload('value') data: { userId: number; id: number; svg: string }
    ) {
        try {
            this.kafka.emit('cookie-cutters.conversion.started', {
                userId: data.userId,
                id: data.id,
            });
            const convertedFilePath = await this.appService.convertSvg(
                data.svg
            );
            this.kafka.emit('cookie-cutters.conversion.finished', {
                userId: data.userId,
                id: data.id,
                location: convertedFilePath,
            });
        } catch (e) {
            this.kafka.emit('cookie-cutters.conversion.failed', {
                userId: data.userId,
                id: data.id,
            });
            this.logger.error(e);
        }
    }
}
