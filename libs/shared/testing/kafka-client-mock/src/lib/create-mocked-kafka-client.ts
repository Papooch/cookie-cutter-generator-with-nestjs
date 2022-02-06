import { Kafka, logLevel } from 'kafkajs';

export const createMockedKafkaClient = <T extends string>(options: {
    groupId: string;
    clientId: string;
    broker: string;
    subscribeTo: T[];
}) => {
    const messages: { topic: string; value: any }[] = [];
    const lastMessageInTopic = (topic: `${T}`) =>
        messages
            .slice()
            .reverse()
            .find((m) => m.topic === topic)?.value;
    const kafka = new Kafka({
        logLevel: logLevel.ERROR,
        clientId: options.clientId,
        brokers: [options.broker],
    });
    const consumer = kafka.consumer({ groupId: options.groupId });
    const producer = kafka.producer();

    async function connect() {
        await Promise.all([
            producer.connect(),
            consumer.connect(),
            ...options.subscribeTo.map((topic) =>
                consumer.subscribe({ topic })
            ),
        ]);
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                messages.push({
                    topic,
                    value: message.value
                        ? JSON.parse(message.value?.toString())
                        : null,
                });
            },
        });
    }

    function disconnect() {
        return Promise.all([consumer.disconnect(), producer.disconnect()]);
    }

    return {
        kafka,
        consumer,
        producer,
        messages,
        lastMessageInTopic,
        connect,
        disconnect,
    };
};
