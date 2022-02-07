import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthzModule } from '@project/api/authz';
import { CookieCuttersModule } from '@project/api/cookie-cutters';
import { ApiAppController } from './api-app.controller';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: 'localhost',
            port: +process.env.POSTGRES_PORT,
            username: 'postgres',
            password: 'postgres',
            autoLoadModels: true,
            sync: {
                alter: true,
            },
            logging: false,
        }),
        AuthzModule,
        CookieCuttersModule,
    ],
    controllers: [ApiAppController],
})
export class ApiAppModule {}
