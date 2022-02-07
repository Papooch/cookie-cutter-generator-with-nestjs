import { Controller, Get } from '@nestjs/common';
import { Public } from '@project/api/authz';

@Controller()
export class ApiAppController {
    //@Public()
    @Get('ping')
    async ping() {
        return 'pong';
    }
}
