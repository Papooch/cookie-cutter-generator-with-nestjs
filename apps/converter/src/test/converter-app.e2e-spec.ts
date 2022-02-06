import fs from 'fs';
import { config } from 'dotenv';
import { Kafka, Consumer, Producer, logLevel } from 'kafkajs';
import waitForExpect from 'wait-for-expect';
import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConverterAppModule } from '../app/converter-app.module';
config({ path: '.env.test' });

describe('converter e2e', () => {
    let app: INestMicroservice;
    let consumer: Consumer;
    let producer: Producer;
    const messages: { topic: string; value: any }[] = [];
    const lastMessageInTopic = (topic: string) =>
        messages
            .slice()
            .reverse()
            .find((m) => m.topic === topic)?.value;

    beforeAll(async () => {
        // spin up mock consumer
        const kafka = new Kafka({
            logLevel: logLevel.ERROR,
            clientId: 'mock-app',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
        });
        consumer = kafka.consumer({ groupId: 'mock-group' });
        producer = kafka.producer();
        await Promise.all([
            producer.connect(),
            consumer.connect(),
            consumer.subscribe({
                topic: 'cookie-cutters.conversion.started',
            }),
            consumer.subscribe({
                topic: 'cookie-cutters.conversion.failed',
            }),
            consumer.subscribe({
                topic: 'cookie-cutters.conversion.finished',
            }),
        ]);
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                messages.push({
                    topic,
                    value: JSON.parse(message.value.toString()),
                });
            },
        });
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
                        clientId: 'converter',
                    },
                    consumer: {
                        groupId: 'converter-consumer',
                    },
                },
            }
        );
        app.enableShutdownHooks();
        await app.listen();
    }, 30_000);

    afterAll(async () => {
        await Promise.all([
            consumer.disconnect(),
            producer.disconnect(),
            app.close(),
        ]);
    }, 30_000);

    describe("on 'cookie-cutters.uploaded'", () => {
        const id = Math.random();
        const userId = Math.random();

        it("should publish to 'started' and 'finished' topics with ids and location when conversion succeeds", async () => {
            await producer.send({
                topic: 'cookie-cutters.uploaded',
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
                    lastMessageInTopic('cookie-cutters.conversion.started')
                ).toEqual({ id, userId });
            });

            let lastMessage: Record<string, any>;
            await waitForExpect(
                () => {
                    lastMessage = lastMessageInTopic(
                        'cookie-cutters.conversion.finished'
                    );
                    expect(lastMessage).toMatchObject({ id, userId });
                },
                40_000, // give enough time for the conversion to finish
                2_000
            );
            expect(fs.existsSync('tmp/' + lastMessage.location)).toBeTrue();
        }, 60_000);

        it("should publish to 'started' and 'failed' topics with ids when the conversion fails", async () => {
            await producer.send({
                topic: 'cookie-cutters.uploaded',
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
                    lastMessageInTopic('cookie-cutters.conversion.started')
                ).toEqual({ id, userId });
            });

            await waitForExpect(
                () => {
                    const lastMessage = lastMessageInTopic(
                        'cookie-cutters.conversion.failed'
                    );
                    expect(lastMessage).toMatchObject({ id, userId });
                },
                40_000, // give enough time for the conversion to fail
                2_000
            );
        }, 60_000);
    });
});
