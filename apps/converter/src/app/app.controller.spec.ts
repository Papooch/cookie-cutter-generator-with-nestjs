import { Test, TestingModule } from '@nestjs/testing';

import { ConverterAppController } from './app.controller';
import { ConverterAppService } from './app.service';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [ConverterAppController],
            providers: [ConverterAppService],
        }).compile();
    });

    describe('getData', () => {
        it('should return "Welcome to converter!"', () => {
            const appController = app.get<ConverterAppController>(
                ConverterAppController
            );
            expect(appController.getData()).toEqual({
                message: 'Welcome to converter!',
            });
        });
    });
});
