import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { RequestUser } from './authz.interfaces';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor() {
        super();
    }
    serializeUser(
        user: RequestUser,
        done: (err: Error, cookieContent: string) => void
    ): void {
        done(null, JSON.stringify(user));
    }

    deserializeUser(
        cookieContent: string,
        done: (err: Error, user: RequestUser) => void
    ): void {
        const userPayload: RequestUser = cookieContent
            ? JSON.parse(cookieContent)
            : null;
        done(null, userPayload);
    }
}
