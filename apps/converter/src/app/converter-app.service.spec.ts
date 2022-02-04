import 'jest-extended';
import fs from 'fs';
import path from 'path';
import mockFs from 'mock-fs';
import { Test } from '@nestjs/testing';
import { CONVERT } from './converter-app.constants';
import { ConverterAppService } from './converter-app.service';

const mockConvert = jest.fn(async (inputFile, outputFile, workdir) => {
    const filePath = path.join(__dirname, workdir, outputFile);
    fs.writeFileSync(filePath, 'file-content');
    return filePath;
});
describe('AppService', () => {
    let service: ConverterAppService;

    beforeEach(async () => {
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

        mockFs({});
    });

    afterEach(mockFs.restore);

    describe('convertSvg', () => {
        it('returns path to the generated output file', async () => {
            const svg = '<svg></svg>';
            const name = 'testfile';
            const result = await service.convertSvg(svg, name);
            const filename = result.split(/\\|\//).pop();
            expect(filename).toStartWith(name);
        });
    });
});
