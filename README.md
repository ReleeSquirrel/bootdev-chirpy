# bootdev-chirpy
A Web Server made using TypeScript for a Boot.dev project.

# How to set up Chirpy

These instructions are for setting up Chirpy in a linux environment

Download the repo

Install nvm - https://github.com/nvm-sh/nvm

Within the project directory, run `nvm use` and if it tells you to use a command to install the right version of node, go ahead and do that.

Within the project directory, run `npm install -D typescript @types/node;npm i express;npm i -D @types/express;npm i drizzle-orm postgres;npm i -D drizzle-kit;npm i argon2;npm i jsonwebtoken;npm i -D @types/jsonwebtoken;npm i -D vitest;` to install required node modules.

Install Postgres version 16+ - https://www.postgresql.org/

Set a password for postgres like `sudo passwd postgres`

Log in to postgres with psql with `sudo -u postgres psql`

Create the chirpy database with `CREATE DATABASE chirpy;`

Connect to the new database with `\c chirpy`

Set the user password for the database with `ALTER USER postgres PASSWORD 'postgres';`

Test that it's working with this SQL statement `SELECT version();`

Quit out of psql with `quit`

You'll need to set up an .env file in the project directory, like the following:

```
DB_URL=""
PORT="8080"
PLATFORM="dev"
SECRET=""
POLKA_KEY="f271c81ff7084ee5b99a5091b42d486e"
```
Set the value of DB_URL to your connection string, which has this format `protocol://username:password@host:port/database?sslmode=disable` and if you are following along exactly, `postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable` will do.
Set the value of SECRET to a unique string for generating JWTs (JSON Web Tokens). If you're on the command line, this command will give you one `openssl rand -base64 64`
POLKA_KEY is a fake API key for testing.

Within the project directory, run `npx drizzle-kit migrate` to finish setting up the database automatically

Within the project directory, run `npm run dev` to start the server.

# Chirpy API

## GET /api/healtz

Takes no body, returns plain text OK

## POST /api/chirps



## GET /api/chirps



## GET /api/chirps/<chirpId>



## DELETE /api/chirps/<chirpId>



## POST /api/users



## PUT /api/users



## POST /api/login



## POST /api/refresh



## POST /api/revoke



## POST /api/polka/webhooks



## POST /admin/metrics



## POST /admin/reset