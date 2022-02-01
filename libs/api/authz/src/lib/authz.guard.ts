import { Request } from 'express';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from './authz.constants';

@Injectable()
export class AuthzGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get(IS_PUBLIC, context.getHandler());
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request>();
        if (request.isAuthenticated()) {
            return true;
        }
        throw new UnauthorizedException();
    }
}
