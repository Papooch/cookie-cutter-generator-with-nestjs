import { Test } from '@nestjs/testing';

import { ConverterAppService } from './app.service';

describe('AppService', () => {
    let service: ConverterAppService;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [ConverterAppService],
        }).compile();

        service = app.get<ConverterAppService>(ConverterAppService);
    });

    describe('getData', () => {
        it('should return "Welcome to converter!"', () => {
            expect(service.getData()).toEqual({
                message: 'Welcome to converter!',
            });
        });
    });
});
