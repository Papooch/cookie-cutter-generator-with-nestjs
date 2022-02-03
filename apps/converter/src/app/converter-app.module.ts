import { Module } from '@nestjs/common';
import { convert } from './convert';
import { CONVERT } from './converter-app.constants';
import { ConverterAppController } from './converter-app.controller';
import { ConverterAppService } from './converter-app.service';

@Module({
    imports: [],
    controllers: [ConverterAppController],
    providers: [
        {
            provide: CONVERT,
            useValue: convert,
        },
        ConverterAppService,
    ],
})
export class ConverterAppModule {}
