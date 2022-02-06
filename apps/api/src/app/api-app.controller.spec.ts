import { Test, TestingModule } from '@nestjs/testing';
import { ApiAppController } from './api-app.controller';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [ApiAppController],
        }).compile();
    });

    describe('ping', () => {
        it('returns "pong"', () => {
            const appController = app.get(ApiAppController);
            return expect(appController.ping()).resolves.toEqual('pong');
        });
    });
});
