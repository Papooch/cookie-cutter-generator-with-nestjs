import { Observable } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { UserTopics, CookieCuttersTopics } from '@project/shared/kafka-topics';
import {
    CookieCuttersConversionFailedDto,
    CookieCuttersConversionFinishedDto,
    CookieCuttersConversionStartedDto,
    CookieCuttersUploadedDto,
} from '@project/shared-kafka-dtos';

export interface KafkaClientTyped extends ClientKafka {
    emit<TResult = any, TInput = any>(
        pattern: UserTopics.REGISTERED,
        data: TInput
    ): Observable<TResult>;
    emit<TResult = any>(
        pattern: `${CookieCuttersTopics.UPLOADED}`,
        data: CookieCuttersUploadedDto
    ): Observable<TResult>;
    emit<TResult = any>(
        pattern: `${CookieCuttersTopics.CONVERSION_STARTED}`,
        data: CookieCuttersConversionStartedDto
    ): Observable<TResult>;
    emit<TResult = any>(
        pattern: `${CookieCuttersTopics.CONVERSION_FINISHED}`,
        data: CookieCuttersConversionFinishedDto
    ): Observable<TResult>;
    emit<TResult = any>(
        pattern: `${CookieCuttersTopics.CONVERSION_FAILED}`,
        data: CookieCuttersConversionFailedDto
    ): Observable<TResult>;
}
