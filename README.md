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
  - Multipart CSV upload. Preferred field name is `file`; the server also
    accepts the first uploaded file as a compatibility fallback.
  - Returns `204` on success.
- `GET /api/class/:classCode/students?offset=<offset>&limit=<limit>`
  - Returns local and external students together, sorted alphanumerically after
    merging.
- `PUT /api/class/:classCode`
  - JSON body: `{ "className": "Updated Name" }`.
  - Updates the class name only and returns `204`.
- `GET /api/reports/workload`
  - Returns workload grouped by teacher display name.
