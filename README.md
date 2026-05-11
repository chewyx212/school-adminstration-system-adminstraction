# School Administration System Assessment

This is my backend implementation for the School Administration System interview
assessment. The main API is built with ExpressJS, Sequelize, MySQL, Axios,
Multer, csv-parser, WinstonJS, TypeScript, and Jest.

## Implementation Notes

I moved the provided external service from host port `5000` to `5001` because I
am using macOS and port `5000` is commonly used by AirPlay. The external service
still listens on `5000` inside Docker, but it is exposed locally as:

```text
http://localhost:5001
```

For the database setup, I used both approaches that are available in the base
project:

- SQL bootstrap scripts in `typescript/database`
- Sequelize models with `sequelize.sync()`

This is intentionally called out because it is redundant. The SQL files are
useful for showing the schema clearly and seeding sample data, but Sequelize can
also create the tables from the models. For a cleaner long-term version, I would
keep Sequelize as the main source of truth and remove the duplicated table DDL,
or move to proper migrations.

For the API implementation, I added a service layer between controllers and the
database models. Controllers are kept thin: they receive requests, do basic
request validation, call services, and return responses. The current validators
are simple handwritten functions because the assessment scope is small. A future
improvement would be to introduce explicit DTOs with validators so the flow is:

```text
raw request -> validator -> DTO -> service
```

The student listing API has default pagination values:

- `offset` defaults to `0`
- `limit` defaults to `10`

For CSV upload, I first explored a more flexible multiple-file upload approach,
but there was no real benefit for this requirement. I reverted it to the simpler
and stricter `upload.single('data')` implementation. If the request is missing a
file or sends multiple files, the API returns a meaningful `400` response.

I also added more meaningful API error responses so validation and runtime
errors are easier to understand. Error responses follow this general shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "CSV file is required"
  }
}
```

This project was implemented with Codex assistance, and I reviewed the generated
code myself, including the structure, behavior, and small tweaks made along the
way.

## Project Structure

```text
external/      Provided external student service
typescript/    Main School Administration System backend
assessment/    Original assessment materials
```

The main backend uses a simple layered structure:

```text
typescript/src/controllers   HTTP request and response handling
typescript/src/services      Business logic
typescript/src/models        Sequelize model definitions
typescript/src/validators    Request and CSV validation
typescript/src/config        Database, logging, upload, and error handling
typescript/src/utils         Shared helper functions
```

## Database

The database contains these main tables:

- `teachers`
- `students`
- `classes`
- `subjects`
- `class_students`
- `course_registrations`

`course_registrations` stores the active relationship between a teacher, a
student, a class, and a subject. `class_students` stores local class membership.
External students are not stored locally; they are fetched from the external API
when needed.

Sample seed data is available in:

```text
typescript/database/seed.sql
```

Docker runs the SQL files in `typescript/database` only when the MySQL container
is first initialized. To reset the local database and reload seed data:

```bash
cd typescript
docker compose down -v
docker compose up -d
```

## Runtime

- NodeJS: Node 12 compatible base project dependencies
- Database: MySQL through Docker Compose
- Backend API: `http://localhost:3000`
- External student service: `http://localhost:5001`

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

## API Endpoints

Swagger UI is available after starting the backend:

```text
http://localhost:3000/api-docs
```

The raw OpenAPI JSON is available at:

```text
http://localhost:3000/api-docs.json
```

### Upload CSV

```http
POST /api/upload
Content-Type: multipart/form-data
```

File field name:

```text
data
```

Success:

```http
204 No Content
```

### List Students In Class

```http
GET /api/class/:classCode/students?offset=<offset>&limit=<limit>
```

Example:

```http
GET /api/class/P1-1/students
```

`offset` and `limit` are optional:

- default `offset`: `0`
- default `limit`: `10`

The response combines local students from MySQL with external students from the
external service, sorts them alphanumerically, and applies pagination after
sorting.

### Update Class Name

```http
PUT /api/class/:classCode
Content-Type: application/json
```

Body:

```json
{
  "className": "Updated Class Name"
}
```

Success:

```http
204 No Content
```

### Workload Report

```http
GET /api/reports/workload
```

Returns teacher workload grouped by teacher name. The report counts distinct
classes per teacher and subject, not the number of students.

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

Commands used to verify this implementation:

```bash
cd typescript
npm run build:ts
npm run lint
npm test -- --runInBand
```
