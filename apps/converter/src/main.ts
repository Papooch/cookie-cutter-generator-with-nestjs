import { exec, execSync } from 'child_process';
import fs from 'fs';
import { join, resolve } from 'path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

// async function bootstrap() {
//     const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//         AppModule,
//         {
//             transport: Transport.KAFKA,
//             options: {
//                 client: {
//                     brokers: ['localhost:29092'],
//                     clientId: 'mailer',
//                 },
//                 consumer: {
//                     groupId: 'converter-consumer',
//                 },
//                 subscribe: {
//                     fromBeginning: true,
//                 },
//             },
//         }
//     );
//     app.enableShutdownHooks();
//     await app.listen();
//     Logger.log(`Application is running`);
// }

// void bootstrap();

console.log('AAAAA');
// execSync('docker-compose up', {
//     env: {
//         CONVERTER_OUTPUT_FILE: 'assets/square.svg',
//         CONVERTER_INPUT_FILE: 'outtest.stl',
//     },
//     shell: 'powershell',
// });

async function run() {
    const dir = 'tmp';
    const fullDir = join(__dirname, dir);
    if (!fs.existsSync(fullDir)) {
        fs.mkdirSync(fullDir, { recursive: true });
    }

    exec(
        'docker-compose up --force-recreate',
        {
            cwd: __dirname,
            env: {
                ...process.env,
                CONVERTER_WORKING_DIRECTORY: __dirname,
                CONVERTER_INPUT_FILE: 'assets/circle.svg',
                CONVERTER_OUTPUT_FILE: dir + '/outtest2.stl',
            },
        },
        (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
        }
    );
}

void run();
