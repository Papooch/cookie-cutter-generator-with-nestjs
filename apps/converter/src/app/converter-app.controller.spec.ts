import { createMock } from '@golevelup/ts-jest';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { KAFKA_CLIENT } from '@project/shared-kafka-client-core';
import { ConverterAppController } from './converter-app.controller';
import { ConverterAppService } from './converter-app.service';

const mockConverterAppService = createMock<ConverterAppService>();
const mockKafka = createMock<ClientKafka>();

describe('ConverterAppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [ConverterAppController],
            providers: [
                {
                    provide: ConverterAppService,
                    useValue: mockConverterAppService,
                },
                {
                    provide: KAFKA_CLIENT,
                    useValue: mockKafka,
                },
            ],
        }).compile();
    });

    it('exists', () => {
        expect(app).toBeDefined();
    });

    describe('convert', () => {
        it.todo(
            "emits 'cookie-cutters.conversion.started' when conversion starts"
        );
        it.todo(
            "emits 'cookie-cutters.conversion.finished' when conversion finishes successfully"
        );
        it.todo(
            "emits 'cookie-cutters.conversion.failed' when conversion fails"
        );
    });
});
