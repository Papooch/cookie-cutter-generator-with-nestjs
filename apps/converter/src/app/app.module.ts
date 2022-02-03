import { Module } from '@nestjs/common';

import { ConverterAppController } from './app.controller';
import { ConverterAppService } from './app.service';

@Module({
    imports: [],
    controllers: [ConverterAppController],
    providers: [ConverterAppService],
})
export class AppModule {}
