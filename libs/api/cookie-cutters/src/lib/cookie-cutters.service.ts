import { WhereOptions } from 'sequelize/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CookieCutter, CookieCutterAttrs, User } from '@project/api/entities';

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

    async getOne(userId: number, id: number): Promise<CookieCutterAttrs> {
        const cutter = await this.cookieCutterRepository.findOne({
            where: {
                id,
            },
        });
        if (!cutter) return null;
        if (cutter.isPublic) return cutter;
        if (cutter.userId === userId) return cutter;
        return null;
    }

    async getAllPublic(page = 1): Promise<[CookieCutterAttrs[], number]> {
        const { rows, count } =
            await this.cookieCutterRepository.findAndCountAll({
                where: {
                    isPublic: true,
                },
                limit: 10,
                offset: (page - 1) * 10,
            });
        return [rows, count];
    }

    async getAllForUser(
        userId: number,
        page = 1
    ): Promise<[CookieCutterAttrs[], number]> {
        const { rows, count } =
            await this.cookieCutterRepository.findAndCountAll({
                where: {
                    userId,
                },
                limit: 10,
                offset: (page - 1) * 10,
            });
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
        return cutter;
    }

    delete() {
        /* */
    }
}
