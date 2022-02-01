import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CookieCutter } from '@project/api/entities';

@Injectable()
export class CookieCuttersService {
    constructor(
        @InjectModel(CookieCutter)
        private readonly cookieCutterRepository: typeof CookieCutter
    ) {}

    create() {
        /* */
    }

    update() {
        /* */
    }

    delete() {
        /* */
    }
}
