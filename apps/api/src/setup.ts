import passport from 'passport';
import session from 'express-session';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export function setup(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    );
    app.use(
        session({
            secret: 'secret',
            resave: false,
            saveUninitialized: false,
            rolling: true,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    return app;
}
