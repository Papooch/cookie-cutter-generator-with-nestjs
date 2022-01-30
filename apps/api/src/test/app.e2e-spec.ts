import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app/app.module';

describe('app', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await NestFactory.create(AppModule);
        await app.init();
    });

    it('responds with "pong"', async () => {
        request(app.getHttpServer).get('/ping').expect('pong');
    });
});
