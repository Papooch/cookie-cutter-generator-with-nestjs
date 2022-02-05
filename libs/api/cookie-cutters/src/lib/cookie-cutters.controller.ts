import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Logger,
    Param,
    Post,
} from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '@project/shared-kafka-client-core';
import { ReqUser } from '@project/api/authz';
import { CookieCuttersService } from './cookie-cutters.service';

@Controller('cookie-cutters')
export class CookieCuttersController {
    private logger = new Logger(CookieCuttersController.name);

    constructor(
        @Inject(KAFKA_CLIENT) private readonly kafka: ClientKafka,
        private readonly cookieCuttersService: CookieCuttersService
    ) {}

    @Post()
    async upload(
        @ReqUser('id') userId: number,
        @Body() cutter: { name: string; svg: string }
    ) {
        /* */
        const { id } = await this.cookieCuttersService.create(userId, cutter);
        this.kafka.emit('cookie-cutters.uploaded', {
            id,
            userId,
            svg: cutter.svg,
        });
    }

    @Get(':id')
    getOne(@ReqUser('id') userId: number, @Param('id') id: number) {
        return this.cookieCuttersService.getOne(userId, id);
    }

    @Delete(':id')
    markForDeletion() {
        /** */
        // this.kafka.emit('cookie-cutters.delete');
    }

    @EventPattern('cookie-cutters.conversion.started')
    async conversionStarted(
        @Payload('value') msg: { userId: number; id: number }
    ) {
        this.logger.log(`Cutter id ${msg.id} started processing`);
        await this.cookieCuttersService.update(msg.userId, msg.id, {
            status: 'PROCESSING',
        });
    }

    @EventPattern('cookie-cutters.conversion.finished')
    async conversionFinished(
        @Payload('value') msg: { userId: number; id: number; location: string }
    ) {
        this.logger.log(`Cutter id ${msg.id} ready to download`);
        await this.cookieCuttersService.update(msg.userId, msg.id, {
            location: msg.location,
            status: 'READY',
        });
    }

    @EventPattern('cookie-cutters.conversion.failed')
    async conversionFailed(
        @Payload('value') msg: { userId: number; id: number }
    ) {
        this.logger.warn(`Cutter id ${msg.id} processing failed`);
        await this.cookieCuttersService.update(msg.userId, msg.id, {
            status: 'FAILED',
        });
    }

    @EventPattern('cookie-cutters.deleted')
    delete() {
        /** */
    }
}
