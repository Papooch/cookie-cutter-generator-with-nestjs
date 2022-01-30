import {
    BeforeApplicationShutdown,
    Controller,
    Get,
    Inject,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MAILER_SERVICE } from './app.constants';

import { AppService } from './app.service';

@Controller()
export class AppController
    implements OnApplicationBootstrap, BeforeApplicationShutdown
{
    constructor(
        @Inject(MAILER_SERVICE) private readonly mailer: ClientKafka,
        private readonly appService: AppService
    ) {}

    async onApplicationBootstrap() {
        await this.mailer.connect();
    }

    async beforeApplicationShutdown() {
        console.log('closing...');
        await this.mailer.close();
    }

    @Get()
    getData() {
        return this.appService.getData();
    }

    @Get('ping')
    async ping() {
        this.mailer.emit('user.registered', { name: 'Ondra' });
        return 'pong';
    }
}
