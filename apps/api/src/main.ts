import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/api-app.module';
import { setup } from './setup';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    setup(app);
    app.enableShutdownHooks();
    const port = process.env.PORT || 3333;
    await app.listen(port);
    Logger.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
