import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator((key, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (key) return req.user[key];
    return req.user;
});
