import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiAppController {
    @Get('ping')
    async ping() {
        return 'pong';
    }
}
