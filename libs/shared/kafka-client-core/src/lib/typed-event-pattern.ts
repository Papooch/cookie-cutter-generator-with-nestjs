import { EventPattern } from '@nestjs/microservices';
import { AllTopics } from '@project/shared/kafka-topics';

export const TypedEventPattern = (topic: `${AllTopics}`) => EventPattern(topic);
