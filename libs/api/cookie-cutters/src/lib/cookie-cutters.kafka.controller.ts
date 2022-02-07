import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { CookieCuttersTopics } from '@project/shared/kafka-topics';
import { TypedEventPattern } from '@project/shared-kafka-client-core';
import {
    CookieCuttersConversionFailedDto,
    CookieCuttersConversionFinishedDto,
    CookieCuttersConversionStartedDto,
} from '@project/shared-kafka-dtos';
import { CookieCuttersService } from './cookie-cutters.service';

@UsePipes(
    new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    })
)
@Controller()
export class CookieCuttersKafkaController {
    private logger = new Logger(CookieCuttersKafkaController.name);

    constructor(private readonly cookieCuttersService: CookieCuttersService) {}

    @TypedEventPattern(CookieCuttersTopics.CONVERSION_STARTED)
    async conversionStarted(
        @Payload('value') msg: CookieCuttersConversionStartedDto
    ) {
        this.logger.log(`Cutter id ${msg.id} started processing`);
        await this.cookieCuttersService.update(msg.userId, msg.id, {
            status: 'PROCESSING',
        });
    }

    @TypedEventPattern(CookieCuttersTopics.CONVERSION_FINISHED)
    async conversionFinished(
        @Payload('value') msg: CookieCuttersConversionFinishedDto
    ) {
        this.logger.log(`Cutter id ${msg.id} ready to download`);
        await this.cookieCuttersService.update(msg.userId, msg.id, {
            location: msg.location,
            status: 'READY',
        });
    }

    @TypedEventPattern(CookieCuttersTopics.CONVERSION_FAILED)
    async conversionFailed(
        @Payload('value') msg: CookieCuttersConversionFailedDto
    ) {
        this.logger.warn(`Cutter id ${msg.id} processing failed`);
        await this.cookieCuttersService.update(msg.userId, msg.id, {
            status: 'FAILED',
        });
    }
}
