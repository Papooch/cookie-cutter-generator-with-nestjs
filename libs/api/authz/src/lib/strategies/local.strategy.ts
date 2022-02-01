import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAttrs } from '@project/api/entities';
import { AuthzService } from '../authz.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authzService: AuthzService) {
        super();
    }

    async validate(
        username: string,
        password: string
    ): Promise<Pick<UserAttrs, 'id' | 'name'>> {
        const user = await this.authzService.verify(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { id: user.id, name: user.name };
    }
}
