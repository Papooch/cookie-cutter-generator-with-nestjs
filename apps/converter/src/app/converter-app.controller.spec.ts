import { Test, TestingModule } from '@nestjs/testing';

import { ConverterAppController } from './converter-app.controller';
import { ConverterAppService } from './converter-app.service';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [ConverterAppController],
            providers: [ConverterAppService],
        }).compile();
    });

    describe('getData', () => {
        /** */
    });
});
