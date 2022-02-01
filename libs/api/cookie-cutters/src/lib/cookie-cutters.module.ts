import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MsvcClientsModule } from '@project/api-msvc-clients';
import { CookieCutter } from '@project/api/entities';
import { CookieCuttersController } from './cookie-cutters.controller';
import { CookieCuttersService } from './cookie-cutters.service';

@Module({
    imports: [MsvcClientsModule, SequelizeModule.forFeature([CookieCutter])],
    controllers: [CookieCuttersController],
    providers: [CookieCuttersService],
    exports: [CookieCuttersService],
})
export class CookieCuttersModule {}
