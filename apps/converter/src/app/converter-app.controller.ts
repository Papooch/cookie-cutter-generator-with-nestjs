import { Controller, Inject, Logger } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { CookieCuttersTopics } from '@project/shared/kafka-topics';
import {
    KAFKA_CLIENT,
    KafkaClientTyped,
    TypedEventPattern,
} from '@project/shared-kafka-client-core';
import { CookieCuttersUploadedDto } from '@project/shared-kafka-dtos';
import { ConverterAppService } from './converter-app.service';

@Controller()
export class ConverterAppController {
    private logger = new Logger(ConverterAppController.name);

    constructor(
        @Inject(KAFKA_CLIENT) private readonly kafka: KafkaClientTyped,
        private readonly appService: ConverterAppService
    ) {}

    @TypedEventPattern(CookieCuttersTopics.UPLOADED)
    async convert(@Payload('value') data: CookieCuttersUploadedDto) {
        try {
            this.kafka.emit(CookieCuttersTopics.CONVERSION_STARTED, {
                userId: data.userId,
                id: data.id,
            });
            const convertedFilePath = await this.appService.convertSvg(
                data.svg
            );
            this.kafka.emit(CookieCuttersTopics.CONVERSION_FINISHED, {
                userId: data.userId,
                id: data.id,
                location: convertedFilePath,
            });
        } catch (e) {
            this.kafka.emit(CookieCuttersTopics.CONVERSION_FAILED, {
                userId: data.userId,
                id: data.id,
            });
            this.logger.error(e);
        }
    }
}
