import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { MsvcClientsModule } from '@project/api-msvc-clients';
import { User } from '@project/api/entities';
import { AuthzController } from './authz.controller';
import { AuthzGuard } from './authz.guard';
import { AuthzService } from './authz.service';
import { SessionSerializer } from './session-serializer';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [
        PassportModule.register({
            session: true,
        }),
        SequelizeModule.forFeature([User]),
        MsvcClientsModule,
    ],
    providers: [
        AuthzService,
        LocalStrategy,
        SessionSerializer,
        {
            provide: APP_GUARD,
            useClass: AuthzGuard,
        },
    ],
    controllers: [AuthzController],
    exports: [AuthzService],
})
export class AuthzModule {}
