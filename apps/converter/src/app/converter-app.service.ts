import path from 'path';
import fs from 'fs';
import * as uuid from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { ConvertFunction } from './convert';
import { CONVERT } from './converter-app.constants';

@Injectable()
export class ConverterAppService {
    constructor(@Inject(CONVERT) private readonly convert: ConvertFunction) {}

    async convertSvg(svg: string) {
        const workdir = 'tmp';
        const fullworkDir = path.join(__dirname, workdir);
        if (!fs.existsSync(fullworkDir)) {
            fs.mkdirSync(fullworkDir, { recursive: true });
        }
        const id = uuid.v4();
        const inputFileName = `${id}-in.svg`;
        const outputFileName = `${id}-out.stl`;
        fs.writeFileSync(path.join(fullworkDir, inputFileName), svg);
        const outputFilePath = await this.convert(
            inputFileName,
            outputFileName,
            workdir
        );
        return outputFilePath;
    }
}
