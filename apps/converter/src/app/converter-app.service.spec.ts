import fs from 'fs';
import path from 'path';
import mockFs from 'mock-fs';
import { Test } from '@nestjs/testing';
import { CONVERT } from './converter-app.constants';
import { ConverterAppService } from './converter-app.service';
import { ConversionError } from './convert';

const mockConvert = jest.fn();
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
        const svg = '<svg></svg>';
        it('generates the converted file and returns a path to it', async () => {
            // arrange
            const resultFileContent = 'file-content';
            mockConvert.mockImplementationOnce(
                async (inputFile, outputFile, workdir) => {
                    const filePath = path.join(__dirname, workdir, outputFile);
                    fs.writeFileSync(filePath, resultFileContent);
                    return filePath;
                }
            );

            // act
            const filePath = await service.convertSvg(svg);

            // assert
            expect(fs.existsSync(filePath)).toBeTrue();
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            expect(fileContent).toEqual(resultFileContent);
        });

        it('throws ConversionError when the conversion fails', () => {
            mockConvert.mockRejectedValueOnce(
                new ConversionError('something wrong')
            );
            return expect(service.convertSvg(svg)).rejects.toThrowError(
                ConversionError
            );
        });
    });
});
