import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { ConverterAppService } from './app.service';

@Controller()
export class ConverterAppController {
    constructor(private readonly appService: ConverterAppService) {}

    @EventPattern('cookie-cutters.uploaded')
    convert() {
        /** */
    }
}
