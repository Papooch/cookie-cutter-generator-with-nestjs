import { createMock } from '@golevelup/ts-jest';
import faker from 'faker';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { CookieCutter, User } from '@project/api/entities';
import { CookieCuttersService } from './cookie-cutters.service';

const mockCookieCutterRepository = createMock<typeof User>();

describe('CookieCuttersService', () => {
    let service: CookieCuttersService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CookieCuttersService,
                {
                    provide: getModelToken(CookieCutter),
                    useValue: mockCookieCutterRepository,
                },
            ],
        }).compile();

        service = module.get(CookieCuttersService);
    });

    it('exists', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('creates a cookie cutter with proper attributes and status WAITING', async () => {
            const userId = faker.datatype.number();
            const name = faker.lorem.words(1);
            const svg = '<svg></svg>';
            (
                mockCookieCutterRepository.create as jest.Mock
            ).mockImplementationOnce((i: Record<any, any>) => ({
                id: faker.datatype.number(),
                ...i,
            }));

            const result = await service.create(userId, { name, svg });
            expect(mockCookieCutterRepository.create).toHaveBeenLastCalledWith({
                userId,
                name,
                svg,
                status: 'WAITING',
            });

            expect(result).toContainKey('id');
        });
    });

    describe('getOne', () => {
        it.todo('returns single record by id if it belongs to the user');
        it.todo('returns single record if cutter is public');
        it.todo("returns null if cookie cutter doesn't exist");
        it.todo(
            "returns null if cookie cutter doesn't belong to the user and is not public"
        );
    });

    describe('getAllPublic', () => {
        it.todo('returns a page of public cookie cutters and total count');
        it.todo('returns empty array if no cutters exist');
    });
    describe('getAllForUser', () => {
        it.todo("returns a page of user's cookie cutters");
        it.todo('returns empty array if no cutters exist');
    });

    describe('update', () => {
        it.todo('updates fields of a cookie cutter');
        it.todo("throws error if cookie cutter doesn't belong to the user");
    });
});
