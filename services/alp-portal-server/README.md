# ALP Portal server

Manage datasets via REST API (proxy) or database (standalone)

## Description

Service is based on [Nest](https://github.com/nestjs/nest) framework.

### Why NestJS
- Framework for developers to create NodeJS applications using modular design patterns
- Follows a well-defined/opinionated architecture (Controller > Service > Repository / Provider)
- Decorator support (which allows reusable code like validation to be easily applied)
- Writing unit tests are easy due to dependency injection & use of Nest CLI
- Code structure is clean, maintainable, testable

The app can be deployed as one of two available modes: `standalone` and `proxy` via environment variable `APP__DEPLOY_MODE`.

### Portal Server
Portal server will handle data from database and both deploy modes have these injected providers:
* DatasetQueryService, DatasetCommandService
* TypeORM Repository (Postgres)
* MinIO S3

### Standalone Portal Server
Standalone mode will not depend on shared services as it accesses data in its internal PG database.

### Proxy Portal Server (To be deprecated)
Proxy mode will also initiate remote calls to shared Portal server and PA config. Injected providers include:
* SharedPortalModule (SharedPortalApi)
* PaConfigApi

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
