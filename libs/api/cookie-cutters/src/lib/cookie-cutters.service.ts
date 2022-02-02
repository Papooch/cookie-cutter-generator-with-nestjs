import { WhereOptions } from 'sequelize/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CookieCutter, CookieCutterAttrs } from '@project/api/entities';

@Injectable()
export class CookieCuttersService {
    constructor(
        @InjectModel(CookieCutter)
        private readonly cookieCutterRepository: typeof CookieCutter
    ) {}

    create(
        userId: number,
        { name, svg }: { name: string; svg: string }
    ): Promise<CookieCutterAttrs> {
        return this.cookieCutterRepository.create({
            userId,
            name,
            svg,
            status: 'WAITING',
        });
    }

    getOne(userId: number, id: number): Promise<CookieCutterAttrs> {
        return this.cookieCutterRepository.findOne({
            where: {
                id,
                userId,
            },
        });
    }

    async getAll(userId?: number): Promise<[CookieCutterAttrs[], number]> {
        const where: WhereOptions<CookieCutterAttrs> = {};
        userId && (where.userId = userId);
        const { rows, count } =
            await this.cookieCutterRepository.findAndCountAll({ where });
        return [rows, count];
    }

    async update(
        userId: number,
        id: number,
        fields: Partial<CookieCutterAttrs>
    ): Promise<CookieCutterAttrs> {
        const cutter = await this.cookieCutterRepository.findOne({
            where: {
                id,
                userId,
            },
        });
        await cutter.update(fields);
        return cutter.toJSON();
    }

    delete() {
        /* */
    }
}
