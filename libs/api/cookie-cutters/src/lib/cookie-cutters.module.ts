import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CookieCutter } from '@project/api/entities';
import { ApiKafkaClientModule } from '@project/api/kafka-client';
import { CookieCuttersKafkaController } from './cookie-cutters.kafka.controller';
import { CookieCuttersRestController } from './cookie-cutters.rest.controller';
import { CookieCuttersService } from './cookie-cutters.service';

@Module({
    imports: [ApiKafkaClientModule, SequelizeModule.forFeature([CookieCutter])],
    controllers: [CookieCuttersRestController, CookieCuttersKafkaController],
    providers: [CookieCuttersService],
    exports: [CookieCuttersService],
})
export class CookieCuttersModule {}
