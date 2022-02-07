import fs from 'fs';
import waitForExpect from 'wait-for-expect';
import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CookieCuttersTopics } from '@project/shared/kafka-topics';
import { createMockedKafkaClient } from '@project/shared/testing/kafka-client-mock';
import { ConverterAppModule } from '../app/converter-app.module';

const mockKafka = createMockedKafkaClient({
    broker: `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
    clientId: 'converter-mock-server',
    groupId: 'converter-mock-consumer',
    subscribeTo: [
        CookieCuttersTopics.CONVERSION_STARTED,
        CookieCuttersTopics.CONVERSION_FINISHED,
        CookieCuttersTopics.CONVERSION_FAILED,
    ],
});

describe('converter e2e', () => {
    let app: INestMicroservice;

    beforeAll(async () => {
        // spin up mock consumer
        await mockKafka.connect();

        // clear tmp folder
        fs.rmSync('tmp', { force: true, recursive: true });

        app = await NestFactory.createMicroservice<MicroserviceOptions>(
            ConverterAppModule,
            {
                logger: false,
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: [
                            `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
                        ],
                        clientId: 'converter-test',
                    },
                    consumer: {
                        groupId: 'converter-consumer-test',
                    },
                },
            }
        );
        app.enableShutdownHooks();
        await app.listen();
    }, 30_000);

    afterAll(async () => {
        await Promise.all([mockKafka.disconnect(), app.close()]);
    }, 30_000);

    describe("on 'cookie-cutters.uploaded'", () => {
        const id = Math.random();
        const userId = Math.random();

        it("should publish to 'started' and 'finished' topics with ids and location when conversion succeeds", async () => {
            await mockKafka.producer.send({
                topic: CookieCuttersTopics.UPLOADED,
                messages: [
                    {
                        value: JSON.stringify({
                            id,
                            userId,
                            svg: '<?xml version="1.0" encoding="UTF-8"?><svg width="50mm" height="50mm" version="1.1" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26.058" cy="25.264" rx="13.095" ry="11.772" style="paint-order:markers fill stroke"/></svg>',
                        }),
                    },
                ],
            });

            await waitForExpect(() => {
                expect(
                    mockKafka.lastMessageInTopic(
                        CookieCuttersTopics.CONVERSION_STARTED
                    )
                ).toEqual({ id, userId });
            });

            let lastMessage: Record<string, any>;
            await waitForExpect(
                () => {
                    lastMessage = mockKafka.lastMessageInTopic(
                        CookieCuttersTopics.CONVERSION_FINISHED
                    );
                    expect(lastMessage).toMatchObject({ id, userId });
                },
                40_000, // give enough time for the conversion to finish
                2_000
            );
            expect(fs.existsSync('tmp/' + lastMessage.location)).toBeTrue();
        }, 60_000);

        it("should publish to 'started' and 'failed' topics with ids when the conversion fails", async () => {
            await mockKafka.producer.send({
                topic: CookieCuttersTopics.UPLOADED,
                messages: [
                    {
                        value: JSON.stringify({
                            id,
                            userId,
                            svg: 'invalid',
                        }),
                    },
                ],
            });

            await waitForExpect(() => {
                expect(
                    mockKafka.lastMessageInTopic(
                        CookieCuttersTopics.CONVERSION_STARTED
                    )
                ).toEqual({ id, userId });
            });

            await waitForExpect(
                () => {
                    const lastMessage = mockKafka.lastMessageInTopic(
                        CookieCuttersTopics.CONVERSION_FAILED
                    );
                    expect(lastMessage).toMatchObject({ id, userId });
                },
                40_000, // give enough time for the conversion to fail
                2_000
            );
        }, 60_000);
    });
});
