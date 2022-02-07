import { SuperTest, Test } from 'supertest';
import faker from 'faker';
import session from 'supertest-session';
import waitForExpect from 'wait-for-expect';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/sequelize';
import { createMockedKafkaClient } from '@project/shared/testing/kafka-client-mock';
import { CookieCuttersTopics } from '@project/shared/kafka-topics';
import {
    CookieCutter,
    CookieCutterAttrs,
    User,
    UserAttrs,
} from '@project/api/entities';
import { ApiAppModule } from '../app/api-app.module';
import { setup } from '../setup';

const mockKafka = createMockedKafkaClient({
    broker: `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
    clientId: 'converter-mock-server',
    groupId: 'converter-mock-consumer',
    subscribeTo: [CookieCuttersTopics.UPLOADED],
});

const testUser = {
    id: undefined,
    name: faker.name.firstName(),
    password: faker.random.word(),
} as UserAttrs;

describe('app', () => {
    let agent: SuperTest<Test>;
    let app: INestApplication;
    let userRepo: typeof User;
    let cutterRepo: typeof CookieCutter;

    beforeAll(async () => {
        await mockKafka.connect();

        app = await NestFactory.create(ApiAppModule, { logger: false });
        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.KAFKA,
            options: {
                client: {
                    brokers: [
                        `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
                    ],
                    clientId: 'api-test',
                },
                consumer: {
                    groupId: 'api-consumer-test',
                },
            },
        });
        setup(app);
        app.enableShutdownHooks();
        await app.startAllMicroservices();
        await app.init();

        agent = session(app.getHttpServer());

        userRepo = app.get<typeof User>(getModelToken(User));
        cutterRepo = app.get<typeof CookieCutter>(getModelToken(CookieCutter));

        // assuming we already have an e2e test for authz
        const { id } = await userRepo.create(testUser);
        testUser.id = id;
        await agent
            .post('/authz/login')
            .send({
                username: testUser.name,
                password: testUser.password,
            })
            .expect(201);
    }, 30_000);

    afterAll(() => Promise.all([mockKafka.disconnect(), app.close()]), 30_000);

    it('responds with "pong"', () => {
        return agent.get('/ping').expect('pong');
    });

    let createdCutter: CookieCutterAttrs;

    describe('REST', () => {
        describe('POST /cookie-cutters ', () => {
            it('creates database entry and emits an event', async () => {
                const result = await agent
                    .post('/cookie-cutters')
                    .send({
                        name: 'test-cutter',
                        svg: '<svg></svg>',
                    })
                    .expect(201);
                createdCutter = result.body;
                expect(createdCutter).toMatchObject({
                    name: 'test-cutter',
                    svg: '<svg></svg>',
                    id: expect.any(Number),
                    status: 'WAITING',
                });
                const cutterInDb = await cutterRepo.findByPk(createdCutter.id);
                expect(cutterInDb).toBeDefined();
                return waitForExpect(() => {
                    expect(
                        mockKafka.lastMessageInTopic(
                            CookieCuttersTopics.UPLOADED
                        )
                    ).toMatchObject({
                        id: createdCutter.id,
                        userId: testUser.id,
                    });
                });
            });
        });

        describe('GET /cookie-cutters/:id', () => {
            it('returns previously created cookie cutter', () => {
                return agent
                    .get(`/cookie-cutters/${createdCutter.id}`)
                    .expect(200)
                    .expect(({ body }) => {
                        expect(body.name).toEqual(createdCutter.name);
                    });
            });

            it("returns 404 if the id doesn't exist", () => {
                return agent.get(`/cookie-cutters/4567`).expect(404);
            });
        });
    });

    describe('Kafka', () => {
        describe('Event "cookie-cutters.conversion.started"', () => {
            it.each([
                ['PROCESSING', CookieCuttersTopics.CONVERSION_STARTED, {}],
                ['FAILED', CookieCuttersTopics.CONVERSION_FAILED, {}],
                [
                    'READY',
                    CookieCuttersTopics.CONVERSION_FINISHED,
                    { location: 'location' },
                ],
            ])(
                'updates cookie cutter status to "%s"',
                async (status, topic, extraPayload) => {
                    await mockKafka.producer.send({
                        topic: topic,
                        messages: [
                            {
                                value: JSON.stringify({
                                    id: createdCutter.id,
                                    userId: testUser.id,
                                    ...extraPayload,
                                }),
                            },
                        ],
                    });
                    await waitForExpect(async () => {
                        const updatedCutter = await cutterRepo.findByPk(
                            createdCutter.id
                        );
                        return expect(updatedCutter.status).toEqual(status);
                    });
                }
            );
        });
    });
});
