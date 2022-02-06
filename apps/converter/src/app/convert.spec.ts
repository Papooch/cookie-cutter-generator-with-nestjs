import { join } from 'path';
import fs, { existsSync } from 'fs';
import { convert } from './convert';
import {
    MalformedInputFileConversionError,
    NoInputFileConversionError,
} from './convert.errors';

// I have no idea how to properly unit test this without
// actually running the conversion
describe('convert', () => {
    let inputFile: string;
    let outputFile: string;
    const randomDir = Math.random().toString(36).slice(-5);
    const workdir = `tmp/${randomDir}`;

    beforeAll(() => {
        if (!fs.existsSync(workdir)) {
            fs.mkdirSync(workdir, { recursive: true });
        }
    });

    beforeEach(() => {
        const randomName = Math.random().toString(36).slice(-5);
        inputFile = randomName + '-in.svg';
        outputFile = randomName + '-out.stl';
    });

    afterAll(() => {
        fs.rmSync(workdir, { force: true, recursive: true });
    });
    describe('Happy path', () => {
        it('creates a stl file and returns the file name', async () => {
            fs.writeFileSync(
                join(workdir, inputFile),
                '<?xml version="1.0" encoding="UTF-8"?><svg width="50mm" height="50mm" version="1.1" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26.058" cy="25.264" rx="13.095" ry="11.772" style="paint-order:markers fill stroke"/></svg>'
            );

            const result = await convert(inputFile, outputFile, workdir);

            expect(result).toEqual(outputFile);
            expect(existsSync(`tmp/${randomDir}/${result}`));
        }, 30_000);
    });

    describe('Exceptions', () => {
        it('rejects with NoInputFileConversionError if the input file is missing', () => {
            return expect(
                convert(inputFile, outputFile, workdir)
            ).rejects.toThrowError(NoInputFileConversionError);
        }, 30_000);
        it('rejects with MalformedInputFileConversionError if the input file is malformed', () => {
            fs.writeFileSync(
                join(workdir, inputFile),
                '<?xml version="1.0" encoding="UTF-8"?>width="50mm" height="50mm" version="1.1" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26.058" cy="25.264" rx="13.095" ry="11.772" style="paint-order:markers fill stroke"/></svg>'
            );

            return expect(
                convert(inputFile, outputFile, workdir)
            ).rejects.toThrowError(MalformedInputFileConversionError);
        }, 30_000);
    });
});
