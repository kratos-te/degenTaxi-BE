# Taxi Baster Game backend

## First time setup

```
nvm use
cp .env.local.example .env
docker-compose up -d
# Run in SQL in the DB: "CREATE EXTENSION pgcrypto;" to allow you to generate UUID column
yarn
yarn globals add knex
(cd src && knex migrate:latest)
```

## Run development environment

`yarn dev`

## Tech stack

- PostgreSQL
- Typescript
- Node.js + Express
- Knex
