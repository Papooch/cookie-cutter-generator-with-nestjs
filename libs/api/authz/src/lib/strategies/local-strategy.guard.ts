import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class LocalStrategyGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const canActivate = (await super.canActivate(context)) as boolean;
        await super.logIn(request);
        return canActivate;
    }
}
