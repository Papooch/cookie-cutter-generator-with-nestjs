import {
    DynamicModule,
    Module,
    ModuleMetadata,
    Provider,
} from '@nestjs/common';
import {
    ClientProvider,
    ClientsModule,
    Transport,
} from '@nestjs/microservices';
import {
    KAFKA_CLIENT,
    KAFKA_CLIENT_OPTIONS,
} from './kafka-client-core.constants';

interface MscvClientsModuleOptions {
    brokerUri: string;
    clientId: string;
    groupId?: string;
}

interface KafkaClientCoreModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useFactory: (...args: any[]) => MscvClientsModuleOptions;
}

@Module({})
export class KafkaClientCoreModule {
    private static kafkaClientFactory(
        options: MscvClientsModuleOptions
    ): ClientProvider {
        return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    brokers: [options.brokerUri],
                    clientId: options.clientId,
                },
                consumer: {
                    groupId: options.groupId ?? `${options.clientId}-consumer`,
                },
            },
        };
    }

    private static getClientsModuleImport(
        optionsProvider: Provider,
        imports: any[] = []
    ) {
        return ClientsModule.registerAsync([
            {
                name: KAFKA_CLIENT,
                imports,
                extraProviders: [optionsProvider],
                inject: [KAFKA_CLIENT_OPTIONS],
                useFactory: this.kafkaClientFactory,
            },
        ]);
    }

    static register(options: MscvClientsModuleOptions) {
        const optionsProvider = {
            provide: KAFKA_CLIENT_OPTIONS,
            useValue: options,
        };
        return {
            module: KafkaClientCoreModule,
            imports: [this.getClientsModuleImport(optionsProvider)],
            exports: [ClientsModule],
        };
    }

    static registerAsync(
        asyncOptions: KafkaClientCoreModuleAsyncOptions
    ): DynamicModule {
        const optionsProvider = {
            provide: KAFKA_CLIENT_OPTIONS,
            inject: asyncOptions.inject,
            useFactory: asyncOptions.useFactory,
        };
        return {
            module: KafkaClientCoreModule,
            imports: [
                this.getClientsModuleImport(
                    optionsProvider,
                    asyncOptions.imports
                ),
            ],
            exports: [ClientsModule],
        };
    }
}
