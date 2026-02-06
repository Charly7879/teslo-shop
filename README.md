<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Stack

* Item stack

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Variable de entorno

Clonar el archivo **.env.template** y reemplazar por tus variables

## Levantar base de datos

```
docker-compose up -d
```

## Rellenar base de datos

```
curl --location 'localhost:3000/api/seed'
```

## Build de producción

1. Crear el archivo ```env.prod```
2. Completar variables de entorno de prod
3. Crear la nueva imagen  
```docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build ```

---

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
