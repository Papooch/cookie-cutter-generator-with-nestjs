import { exec, execSync } from 'child_process';
import {
    ConversionError,
    MalformedInputFileConversionError,
    NoInputFileConversionError,
} from './convert.errors';

export type ConvertFunction = (
    inputFile: string,
    outputFile: string,
    workdir?: string
) => Promise<string>;

export const convert: ConvertFunction = (
    inputFile: string,
    outputFile: string,
    workdir = 'tmp'
) =>
    new Promise((resolve, reject) => {
        /**
         * relative path to process.cwd() from `CONVERTER_SCAD_FILE`
         * this is needed in order for openscad to find the input file
         * because it chokes on absolute paths *on Windows*
         */
        const relativeRoot = '../'.repeat(
            process.env.CONVERTER_SCAD_FILE.split('/').length - 1
        );
        exec(
            `docker run ` +
                `--name=openscad-converter ` +
                `-w /app ` +
                `-v ${process.cwd()}:/app ` +
                `wtnb75/openscad ` +
                `openscad ${process.env.CONVERTER_SCAD_FILE} ` +
                `-o ${workdir}/${outputFile} ` +
                `-D file=\\"${relativeRoot}${workdir}/${inputFile}\\"`,
            {
                cwd: process.cwd(),
            },
            (error) => {
                execSync(`docker rm openscad-converter`);
                if (error) {
                    if (error.message.match(/Can't open file/)) {
                        return reject(
                            new NoInputFileConversionError(
                                `Input file doesn't exist`
                            )
                        );
                    }
                    if (error.message.match(/Error parsing file/)) {
                        return reject(
                            new MalformedInputFileConversionError(
                                'Input file is malformed'
                            )
                        );
                    }
                    return reject(new ConversionError(error.message));
                }
                resolve(outputFile);
            }
        );
    });
