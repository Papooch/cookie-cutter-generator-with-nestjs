import { Test } from '@nestjs/testing';
import { CONVERT } from './converter-app.constants';
import { ConverterAppService } from './converter-app.service';

const mockConvert = jest.fn();
describe('AppService', () => {
    let service: ConverterAppService;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: CONVERT,
                    useValue: mockConvert,
                },
                ConverterAppService,
            ],
        }).compile();

        service = app.get<ConverterAppService>(ConverterAppService);
    });

    describe('getData', () => {
        it('should return "Welcome to converter!"', () => {
            /** */
        });
    });
});
