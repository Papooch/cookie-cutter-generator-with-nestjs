import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@project/api/entities';
import { ApiKafkaClientModule } from '@project/api/kafka-client';
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
        ApiKafkaClientModule,
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
