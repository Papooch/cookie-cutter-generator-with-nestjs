import { Controller, Logger } from '@nestjs/common';
import { UserTopics } from '@project/shared/kafka-topics';
import { TypedEventPattern } from '@project/shared-kafka-client-core';
import { AppService } from './app.service';

@Controller()
export class AppController {
    private logger = new Logger(AppController.name);

    constructor(private readonly appService: AppService) {}

    @TypedEventPattern(UserTopics.REGISTERED)
    onUserRegistered(data: any) {
        this.logger.log(`received:`, data);
        const response = this.appService.getData();
        this.logger.log(JSON.stringify(response));
    }
}
