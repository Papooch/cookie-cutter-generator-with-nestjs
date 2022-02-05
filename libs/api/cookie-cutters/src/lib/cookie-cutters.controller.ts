import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
} from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '@project/shared-kafka-client-core';
import { ReqUser } from '@project/api/authz';
import { CookieCuttersService } from './cookie-cutters.service';

@Controller('cookie-cutters')
export class CookieCuttersController {
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
    async conversionStarted(@Payload() msg: { userId: number; id: number }) {
        await this.cookieCuttersService.update(msg.userId, msg.id, {
            status: 'PROCESSING',
        });
    }

    @EventPattern('cookie-cutters.conversion.finished')
    async conversionFinished(
        @Payload() msg: { userId: number; id: number; location }
    ) {
        await this.cookieCuttersService.update(msg.userId, msg.id, {
            location: msg.location,
            status: 'READY',
        });
    }

    @EventPattern('cookie-cutters.deleted')
    delete() {
        /** */
    }
}
