import 'express-session';
import { Request, Response } from 'express';
import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Req,
    Res,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '@project/api-msvc-clients';
import { AuthzFilter } from './authz.filter';
import { AuthzService } from './authz.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalStrategyGuard } from './strategies/local-strategy.guard';
import { Public } from './decorators/public.route.decorator';
import { ReqUser } from './decorators/req-user.param.decorator';
import { RequestUser } from './authz.interfaces';

@UseFilters(AuthzFilter)
@Controller('authz')
export class AuthzController {
    constructor(
        private readonly authzService: AuthzService,
        @Inject(KAFKA_CLIENT) private readonly kafka: ClientKafka
    ) {}

    @Public()
    @Post('register')
    async registerUser(@Body() userToCreate: CreateUserDto) {
        const user = await this.authzService.ceateUser(userToCreate);
        this.kafka.emit('user.registered', user);
        return user;
    }

    @Public()
    @UseGuards(LocalStrategyGuard)
    @Post('login')
    async login(@Req() req: Request) {
        return req.user;
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        req.logOut();
        req.session.destroy(() => {
            res.cookie('connect.sid', '', { maxAge: 0 });
            res.send({ message: 'ok' });
        });
    }

    @Get('whoami')
    async whoami(@ReqUser() user: RequestUser) {
        return user;
    }
}
