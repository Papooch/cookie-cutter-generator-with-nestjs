import { exec } from 'child_process';
import { ConversionError, convert } from './convert';

jest.mock('child_process', () => ({
    exec: jest.fn(),
}));

describe('convert', () => {
    const inputFile = 'iFile';
    const outputFile = 'oFile';
    const workdir = 'wd';

    describe('Happy path', () => {
        beforeEach(() => {
            (exec as unknown as jest.Mock).mockImplementationOnce(
                (arg, opts, cb) => {
                    cb(null, 'ok', null);
                }
            );
        });
        it('runs the converter with correct ENV variables', async () => {
            await convert(inputFile, outputFile, workdir);

            expect(exec).toHaveBeenCalledWith(
                expect.any(String),
                {
                    cwd: __dirname,
                    env: expect.objectContaining({
                        ...process.env,
                        CONVERTER_WORKING_DIRECTORY: __dirname,
                        CONVERTER_INPUT_FILE: `${workdir}/${inputFile}`,
                        CONVERTER_OUTPUT_FILE: `${workdir}/${outputFile}`,
                    }),
                },
                expect.any(Function)
            );
        });

        it('returns the output file name on success', async () => {
            const result = await convert(inputFile, outputFile);

            expect(result).toEqual(outputFile);
        });
    });

    describe('Exceptions', () => {
        it('rejects with ConversionError if error is returned from exec', () => {
            (exec as unknown as jest.Mock).mockImplementationOnce(
                (arg, opts, cb) => {
                    cb(new Error('something wrong'), null, null);
                }
            );

            return expect(
                convert(inputFile, outputFile)
            ).rejects.toThrowWithMessage(ConversionError, 'something wrong');
        });
        it('rejects with ConversionError if stderr contains error from openscad', () => {
            (exec as unknown as jest.Mock).mockImplementationOnce(
                (arg, opts, cb) => {
                    cb(null, 'ok', 'openscad  | something wrong');
                }
            );

            return expect(convert(inputFile, outputFile)).rejects.toThrow(
                ConversionError
            );
        });
    });
});
