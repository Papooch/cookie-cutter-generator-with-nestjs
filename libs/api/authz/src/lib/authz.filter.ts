import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AuthzError, UserExistsAuthzError } from './authz.errors';

@Catch(AuthzError)
export class AuthzFilter extends BaseExceptionFilter {
    catch(exception: AuthzError, host: ArgumentsHost): void {
        if (exception instanceof UserExistsAuthzError) {
            return super.catch(
                new ConflictException('User with that name already exists'),
                host
            );
        }
        super.catch(exception, host);
    }
}
