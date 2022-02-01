import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthzModule } from '@project/api/authz';
import { AppController } from './api-app.controller';
import { AppService } from './api-app.service';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            autoLoadModels: true,
            sync: {
                alter: true,
            },
            logging: false,
        }),
        AuthzModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
