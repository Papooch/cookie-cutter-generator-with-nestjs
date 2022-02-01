import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './api-app.controller';
import { AppService } from './api-app.service';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();
    });

    describe('getData', () => {
        it('should return "Welcome to gateway!"', () => {
            const appController = app.get<AppController>(AppController);
            expect(appController.ping()).toEqual('pong');
        });
    });
});