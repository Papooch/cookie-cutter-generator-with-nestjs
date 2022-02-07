# Cookie Cutter Generator with NestJS Microservices

This is an example project with NestJS and Kafka

The main idea of the app is that users would upload SVG images that will be converted into 3D cookie-cutters using an OpenSCAD script, that I created to make custom cookie cutters for Christmas.

![Before and after](/images/before-after.png)

Now, the app is divided into 3 parts:

-   API
    -   for CRUD on the database
-   Converter
    -   for converting a SVG image into a 3D STL model
-   Notifications
    -   that would (someday) contain email and websockets gateways to send notifications

It is very much a work in progress, because I spent an unhealthy amount of time making OpenSCAD run in a container while also having access to the file system (all while working on a Windows machine), so most of the app is not ready at all, but the main flow that currently works is this:

[![](https://mermaid.ink/img/pako:eNp1kkFugzAQRa8y8jpcwAukKqmqSl1UQXTFZmoPYAVsao8jVVHuXkMgNEX1yva8_-db44tQTpOQItBXJKvoYLDx2FcW0ioD-SzPn95fJRypMYHJw62U7rJUOiDjJwaSULDzBDEpViDPRwcJ7rT1e3ONsVt07wmZIFAIxtmtrBw6hxqKj5d_cswGnpTzeuuP6vQg3Dt7Js9jSZswIKsWAqNnoDNZvrF3KFtiTAhpGLxTY1Tb_OY3ocpB_w21ej6EOEYLajqu79-2v0etjTWhXXqLnejJ92h0muhlFFeCW-qpEjJtNdUYO65EZa8JjVOoZ23S5ISssQu0ExjZFd9WCck-0gLNv2Kmrj_M3LmW)](https://mermaid.live/edit#pako:eNp1kkFugzAQRa8y8jpcwAukKqmqSl1UQXTFZmoPYAVsao8jVVHuXkMgNEX1yva8_-db44tQTpOQItBXJKvoYLDx2FcW0ioD-SzPn95fJRypMYHJw62U7rJUOiDjJwaSULDzBDEpViDPRwcJ7rT1e3ONsVt07wmZIFAIxtmtrBw6hxqKj5d_cswGnpTzeuuP6vQg3Dt7Js9jSZswIKsWAqNnoDNZvrF3KFtiTAhpGLxTY1Tb_OY3ocpB_w21ej6EOEYLajqu79-2v0etjTWhXXqLnejJ92h0muhlFFeCW-qpEjJtNdUYO65EZa8JjVOoZ23S5ISssQu0ExjZFd9WCck-0gLNv2Kmrj_M3LmW)

There are no notifications at the moment (apart from the notifications app logging to console when user registers) and very little error handling, also no ConfigService and other fancy stuff, just good old process.env...

Ideally, the notifications app would provide a websocket gateway that the user would connect to and it will push events about the conversion status to update the frontend.

Also... there is no frontend, so you need to use a tool like Postman.

## Usage

1. spin up docker-compose: `npm run docker:up`

2. run all apps: `npm run start:all`

    - or selectively with `nx serve <app-name>`

3. Register user

    - POST to `/authz/register` with `{ username, password }`

4. Login

    - POST to `/authz/login` with same `{ username, password }`

5. Upload SVG

    - POST to `/cookie-cutters` with `{ name, svg }`
    - no file upload, you'll need to manually copy/paste the SVG string, examples are provided in `example-svg`

6. Wait for the result

    - the result will be available as a file with a random name in `/tmp`
    - this simulates a storage service, which was also originally planned

7. tear down docker-compose: `npm run docker:down`

## Dependency graph

-   To view live dependency graph, run `npm run nx dep-graph`

## Unit Tests

-   `npm run test <app-or-lib-name>`
-   `npm run test <app-or-lib-name> -- --testFile=<regex-pattern>`

## E2E Tests

1. spin up testing containers `npm run docker:up:test`
2. Run e2e tests
    - `npm run e2e api`
    - `npm run e2e converter`

---

This app contains a very dumbed down version of the original OpenSCAD script, it would take about 30 minutes to generate the STL. A preview of what the full version is capable of is show below:

![Before and after](/images/full-version.png)
(I should probably finally upload it to github as well...)
