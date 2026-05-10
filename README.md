# School Administration System

Backend implementation for the School Administration System assessment. The main
service is built with ExpressJS, Sequelize, MySQL 8.0, Axios, Multer,
csv-parser, WinstonJS, and Jest.

## Runtime

- NodeJS: tested with Node 12 compatible dependencies from the provided base
  project.
- Database: MySQL 8.0, started through Docker Compose.
- External student service: local Docker service published on
  `http://localhost:5001`.

## Setup

Install dependencies for both services:

```bash
cd external
npm install

cd ../typescript
npm install
```

Create local environment config for the backend:

```bash
cd typescript
cp .env.sample .env
```

Start the backend in development mode:

```bash
cd typescript
npm run start:dev
```

The development start command launches Docker Compose first. MySQL is published
on host port `33306`; the external student service is published on host port
`5001`.

The database bootstrap folder contains sample seed data in
`typescript/database/seed.sql`. Docker runs it when the MySQL container is first
initialized. If the database already exists, reset it with:

```bash
cd typescript
docker compose down -v
docker compose up -d
```

## Tests And Checks

Run the backend test suite:

```bash
cd typescript
npm test
```

Run TypeScript build and lint checks:

```bash
cd typescript
npm run build:ts
npm run lint
```

## API Endpoints

- `POST /api/upload`
  - Multipart CSV upload. File field name is `data`.
  - Returns `204` on success.
- `GET /api/class/:classCode/students?offset=<offset>&limit=<limit>`
  - Returns local and external students together, sorted alphanumerically after
    merging. `offset` is optional and defaults to `0`; `limit` is optional and
    defaults to `10`.
- `PUT /api/class/:classCode`
  - JSON body: `{ "className": "Updated Name" }`.
  - Updates the class name only and returns `204`.
- `GET /api/reports/workload`
  - Returns workload grouped by teacher display name.
