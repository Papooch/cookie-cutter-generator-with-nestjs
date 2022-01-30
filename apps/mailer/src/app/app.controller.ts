import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
    private logger = new Logger(AppController.name);

    constructor(private readonly appService: AppService) {}

    @EventPattern('user.registered')
    getData(data: any) {
        this.logger.log(`received:`, data);
        const response = this.appService.getData();
        this.logger.log(JSON.stringify(response));
    }
}
