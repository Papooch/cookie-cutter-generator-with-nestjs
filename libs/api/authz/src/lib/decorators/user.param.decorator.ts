import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((key, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (key) return req.user[key];
    return req.user;
});
