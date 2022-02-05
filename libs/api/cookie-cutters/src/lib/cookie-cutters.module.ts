import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CookieCutter } from '@project/api/entities';
import { ApiKafkaClientModule } from '@project/api/kafka-client';
import { CookieCuttersController } from './cookie-cutters.controller';
import { CookieCuttersService } from './cookie-cutters.service';

@Module({
    imports: [ApiKafkaClientModule, SequelizeModule.forFeature([CookieCutter])],
    controllers: [CookieCuttersController],
    providers: [CookieCuttersService],
    exports: [CookieCuttersService],
})
export class CookieCuttersModule {}
