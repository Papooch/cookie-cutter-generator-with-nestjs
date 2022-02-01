import { Controller, Delete, Inject, Post } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '@project/api-msvc-clients';
import { CookieCuttersService } from './cookie-cutters.service';

@Controller('cookie-cutters')
export class CookieCuttersController {
    constructor(
        @Inject(KAFKA_CLIENT) private readonly kafka: ClientKafka,
        private readonly cookieCuttersService: CookieCuttersService
    ) {}

    @Post()
    upload() {
        /* */
        const { id, outlineSvg, detailSvg } =
            this.cookieCuttersService.create();
        this.kafka.emit('cookie-cutters.uploaded');
    }

    getOne() {
        /* */
    }

    @Delete('/:id')
    archive() {
        /** */
    }

    @Delete('/:id/')
    markForDeletion() {
        /** */
        this.kafka.emit('cookie-cutters.delete');
    }

    @EventPattern('cookie-cutters.deleted')
    delete() {
        /** */
    }
}
