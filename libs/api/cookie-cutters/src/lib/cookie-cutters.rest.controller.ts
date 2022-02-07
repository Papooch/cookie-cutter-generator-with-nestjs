import {
    Body,
    Controller,
    Get,
    Inject,
    Logger,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ReqUser } from '@project/api/authz';
import { KAFKA_CLIENT } from '@project/shared-kafka-client-core';
import { CookieCuttersService } from './cookie-cutters.service';
import { CreateCookieCutterDto } from './dto/create-cookie-cutter.dto';

@Controller('cookie-cutters')
export class CookieCuttersRestController {
    private logger = new Logger(CookieCuttersRestController.name);

    constructor(
        @Inject(KAFKA_CLIENT) private readonly kafka: ClientKafka,
        private readonly cookieCuttersService: CookieCuttersService
    ) {}

    @Post()
    async upload(
        @ReqUser('id') userId: number,
        @Body() cutter: CreateCookieCutterDto
    ) {
        const createdCutter = await this.cookieCuttersService.create(
            userId,
            cutter
        );
        this.logger.log(`Cutter id ${createdCutter.id} ready to uploaded`);
        this.kafka.emit('cookie-cutters.uploaded', {
            id: createdCutter.id,
            userId,
            svg: cutter.svg,
        });
        return createdCutter;
    }

    @Get(':id')
    async getOne(@ReqUser('id') userId: number, @Param('id') id: number) {
        const cutter = await this.cookieCuttersService.getOne(userId, id);
        if (!cutter) throw new NotFoundException();
        return cutter;
    }
}
