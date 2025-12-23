# bootdev-chirpy
A Web Server made using TypeScript for a Boot.dev project.

# How to set up Chirpy

These instructions are for setting up Chirpy in a linux environment

Download the repo

Install nvm - https://github.com/nvm-sh/nvm

Within the project directory, run `nvm use` and if it tells you to use a command to install the right version of node, go ahead and do that.

Install Postgres version 16+ - https://www.postgresql.org/

Set a password for postgres like `sudo passwd postgres`

Log in to postgres with psql with `sudo -u postgres psql`

Create the chirpy database with `CREATE DATABASE chirpy;`

Connect to the new database with `\c chirpy`

Set the user password for the database with `ALTER USER postgres PASSWORD 'postgres';`

Test that it's working with this SQL statement `SELECT version();`

Quit out of psql with `quit`

You'll need to set up a .env file in the project directory with the line `DB_URL="<connection_string>"` and replace `<connection_string>` with your database connection string, which has this format `protocol://username:password@host:port/database?sslmode=disable` if you are following along exactly, `postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable` will do.

Within the project directory, run `npx drizzle-kit migrate` to finish setting up the database automatically

Within the project directory, run `npm run dev` to start the server.