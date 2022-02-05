import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { ConverterAppService } from './converter-app.service';

@Controller()
export class ConverterAppController {
    constructor(private readonly appService: ConverterAppService) {}

    @EventPattern('cookie-cutters.uploaded')
    async convert(
        @Payload('value') data: { userId: number; id: number; svg: string }
    ) {
        console.log('got this', data);
        const convertedFilePath = await this.appService.convertSvg(data.svg);
        console.log('File converted ', convertedFilePath);
    }
}
