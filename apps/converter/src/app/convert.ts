import { exec } from 'child_process';

export class ConversionError extends Error {}

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
        exec(
            'docker-compose up --force-recreate',
            {
                cwd: __dirname,
                env: {
                    ...process.env,
                    CONVERTER_WORKING_DIRECTORY: __dirname,
                    CONVERTER_INPUT_FILE: workdir + '/' + inputFile,
                    CONVERTER_OUTPUT_FILE: workdir + '/' + outputFile,
                },
            },
            (error, stdout, stderr) => {
                if (error) {
                    return reject(new ConversionError(error.message));
                }
                console.log('stdout: ', stdout);
                console.log('stderr: ', stderr);
                let message = '';
                message += `\nstdout: ${stdout}`;
                message += `\nstderr: ${stderr}`;
                if (stderr && stderr.includes('openscad  |')) {
                    return reject(new ConversionError(message));
                }
                if (stdout && stdout.includes('openscad exited with code 1')) {
                    return reject(new ConversionError('Invalid SVG file'));
                }
                resolve(outputFile);
            }
        );
    });
