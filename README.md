## Table of Contents

- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Deploying](#deploying)

## Installation

To get started, you'll need to install the following dependencies:

Postgres

## Database Setup

Create the database in postgres:

```bash
psql postgres
```

```sql
CREATE DATABASE next_js_template;
CREATE USER next_js_template_admin WITH PASSWORD 'next_js_template_passsword';
ALTER USER next_js_template_admin CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE next_js_template TO next_js_template_admin;
```

Migrate the database:

```bash
npx dotenv-cli -e .env.development npx prisma migrate deploy
```

seed the database:

```bash
npx dotenv-cli -e .env.development npx prisma db seed
```

## Running the App

```bash
  npm run dev
```

## Testing

Setup test database and server:

```bash
psql postgres
```

```sql
CREATE DATABASE next_js_template_test;
CREATE USER next_js_template_admin_test WITH PASSWORD 'next_js_template_passsword_test';
ALTER USER next_js_template_admin_test CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE next_js_template_test TO next_js_template_admin_test;
```

create a .env.test file with a `DATABASE_URL` value using these new values as per `.env.development.example`. Also with a `JWT_SECRET`

```bash
  NODE_ENV=test npx dotenv -e .env.test -- npx prisma generate
  NODE_ENV=test npx dotenv -e .env.test -- npx prisma migrate reset --force
  npm run dev:test
```

Run tests on terminal

```bash
  npm run test:cypress
```

Run tests on browser

```bash
  npm run test:open
```

or to run the setup and the tests on the terminal do:

```bash
  npx dotenv -e .env.test -- npm run test
```

## Deploying

You need to create 2 new variables
JWT_SECRET=
NEXTAUTH_SECRET=

Please check the env.development.example for more variables
To create new values for the variables you can do:

```bash
  openssl rand -hex 32
```

We are deployed on vercel.
