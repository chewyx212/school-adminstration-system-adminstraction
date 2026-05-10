# Project Context

This repository contains a school administration backend workspace. Ignore the
`assessment/` directory for project implementation context and future agent
work unless the user explicitly asks to inspect it.

## Repository Layout

- `typescript/` is the primary School Administration System backend.
  - Express app entrypoints live in `src/app.ts`, `src/router.ts`, and
    `src/server.ts`.
  - API controllers live in `src/controllers/`.
  - Database configuration is in `src/config/database.ts`.
  - Docker Compose starts MySQL and the external service from
    `docker-compose.yml`.
  - SQL bootstrap files belong in `database/`.
- `external/` is a companion external student service used by the backend.
  - Express app files live at the package root.
  - Student data generation lives in `services/StudentGeneratorService.js`.
  - Student API routing lives in `controllers/StudentController.js`.
- `school-administration-system.postman_collection.json` contains API request
  examples.

## Common Commands

Run commands from the package directory they belong to.

For the TypeScript backend:

```bash
cd typescript
npm test
npm run build:ts
npm run lint
npm run start:dev
```

For the external service:

```bash
cd external
npm test
npm run lint
npm start
```

`typescript/npm run start:dev` starts Docker Compose services first, including
MySQL on host port `33306` and the external service on host port `5001`.

## Development Notes

- Keep source changes scoped to `typescript/` or `external/` unless the user asks
  for repository-level configuration.
- Do not commit generated dependency folders, local environment files, logs, or
  build output.
- The TypeScript backend currently exposes `/api/upload` for CSV upload and
  `/api/healthcheck` for health checks.
- The external service exposes `/students` with `class`, `offset`, and `limit`
  query parameters.
- Environment defaults for the backend are in `typescript/src/config/database.ts`;
  local overrides should stay in ignored `.env` files.

## GitHub Workflow

- Before creating a pull request, always review the intended PR diff first.
- Treat code review as required before staging, committing, pushing, or opening
  a PR when the user asks to create or publish a PR.
