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

Function - Test if the server is up and responding.

Takes an HTTP POST request in the following form:

```
GET http://localhost:8080/api/healthz HTTP/1.1
```

Responds in the following form:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 2
ETag: W/"2-nOO9QiTIwXgNtWtBJezz8kv3SLc"
Date: Mon, 29 Dec 2025 01:32:24 GMT
Connection: close

OK
```

## POST /api/chirps

Function - Posts a new chirp.

Options:

- ?sort=asc - Sort in ascending order (default)
- ?authorId=<userId> - Only returns posts belonging to user <userId>

Takes an HTTP POST request in the following form:

```
POST http://localhost:8080/api/chirps HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiI1ZjhiYjQyZi0xMzcyLTQ0M2UtYjI4Ny1jOGU5ZGZhY2EzMGQiLCJpYXQiOjE3NjY5ODI3NzQsImV4cCI6MTc2Njk4NjM3NH0.Ejnu4fR48wO_XiWtOnXrHl3pzl-yq9fvYL71pKJle_0

{
  "body": "These are the contents of the post."
}
```

The value of body is the body of the chirp you are posting.

Responds in the following form:

```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 216
ETag: W/"d8-/fajl1v6h220qIn9uJc/mEm+5m4"
Date: Mon, 29 Dec 2025 04:44:11 GMT
Connection: close

{
  "id": "f7c9164e-f9f2-4c96-ae10-259511f3d39b",
  "createdAt": "2025-12-28T23:44:11.964Z",
  "updatedAt": "2025-12-28T23:44:11.964Z",
  "body": "These are the contents of the post.",
  "userId": "5f8bb42f-1372-443e-b287-c8e9dfaca30d"
}
```

## GET /api/chirps

Function - Get all the chirps in the database.

Takes an HTTP GET request in the following form:

```
GET http://localhost:8080/api/chirps HTTP/1.1
```

Responds in the following form:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2055
ETag: W/"807-udS0RKwoSBzTZRLYCWBVrFJCK9w"
Date: Mon, 29 Dec 2025 04:55:12 GMT
Connection: close

[
  {
    "id": "f7c9164e-f9f2-4c96-ae10-259511f3d39b",
    "createdAt": "2025-12-28T23:44:11.964Z",
    "updatedAt": "2025-12-28T23:44:11.964Z",
    "body": "These are the contents of the post.",
    "userId": "5f8bb42f-1372-443e-b287-c8e9dfaca30d"
  },
  {
    "id": "5c6ff45a-68fa-4bf2-867b-393e20854594",
    "createdAt": "2025-12-28T23:50:36.536Z",
    "updatedAt": "2025-12-28T23:50:36.536Z",
    "body": "Test post two.",
    "userId": "5f8bb42f-1372-443e-b287-c8e9dfaca30d"
  }
]
```

## GET /api/chirps/<chirpId>

Function - Get a specific chirp.

Takes an HTTP GET request in the following form:

```
GET http://localhost:8080/api/chirps/f7c9164e-f9f2-4c96-ae10-259511f3d39b HTTP/1.1
```

Responds in the following form:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 216
ETag: W/"d8-/fajl1v6h220qIn9uJc/mEm+5m4"
Date: Mon, 29 Dec 2025 05:08:21 GMT
Connection: close

{
  "id": "f7c9164e-f9f2-4c96-ae10-259511f3d39b",
  "createdAt": "2025-12-28T23:44:11.964Z",
  "updatedAt": "2025-12-28T23:44:11.964Z",
  "body": "These are the contents of the post.",
  "userId": "5f8bb42f-1372-443e-b287-c8e9dfaca30d"
}
```

## DELETE /api/chirps/<chirpId>

Function - Delete a specific chirp.

Takes an HTTP DELETE request in the following form:

```
DELETE http://localhost:8080/api/chirps/f7c9164e-f9f2-4c96-ae10-259511f3d39b HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiI1ZjhiYjQyZi0xMzcyLTQ0M2UtYjI4Ny1jOGU5ZGZhY2EzMGQiLCJpYXQiOjE3NjY5ODI3NzQsImV4cCI6MTc2Njk4NjM3NH0.Ejnu4fR48wO_XiWtOnXrHl3pzl-yq9fvYL71pKJle_0
```

Responds in the following form:

```
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Mon, 29 Dec 2025 05:10:28 GMT
Connection: close
```

## POST /api/users

Function - Create a new user record.

Takes an HTTP POST request in the following form:

```
POST http://localhost:8080/api/users HTTP/1.1
Content-Type: application/json

{
  "email": "SteveOne",
  "password": "SteveOnePassword"
}
```

The value of email is the email address of the new user.
The value of password is the password of the new user.

Responds in the following form:

```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 162
ETag: W/"a2-WJ9fpLa40QnFEMXv5gL0w/Uv4Dg"
Date: Mon, 29 Dec 2025 04:22:56 GMT
Connection: close

{
  "id": "5f8bb42f-1372-443e-b287-c8e9dfaca30d",
  "createdAt": "2025-12-28T23:22:56.903Z",
  "updatedAt": "2025-12-28T23:22:56.903Z",
  "email": "SteveOne",
  "isChirpyRed": false
}
```

## PUT /api/users

Function - Update the email and password for a user

Takes an HTTP PUT request in the following form:

```
PUT http://localhost:8080/api/users HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiI1ZjhiYjQyZi0xMzcyLTQ0M2UtYjI4Ny1jOGU5ZGZhY2EzMGQiLCJpYXQiOjE3NjY5ODI3NzQsImV4cCI6MTc2Njk4NjM3NH0.Ejnu4fR48wO_XiWtOnXrHl3pzl-yq9fvYL71pKJle_0

{
  "email": "SteveOne@steves.com",
  "password": "SteveOnePasswordButStronger"
}
```

The value of email is the new email address of the user.
The value of password is the new password of the user.

Responds in the following form:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 175
ETag: W/"af-qdyo18NmgRF7sfpTrj3fiXbjETM"
Date: Mon, 29 Dec 2025 04:39:00 GMT
Connection: close

{
  "id": "5f8bb42f-1372-443e-b287-c8e9dfaca30d",
  "created_at": "2025-12-28T23:22:56.903Z",
  "updated_at": "2025-12-29T04:39:00.876Z",
  "email": "SteveOne@steves.com",
  "isChirpyRed": false
}
```

## POST /api/login

Function - Responds with an access token and a refresh token for the given user.

Takes an HTTP POST request in the following form:

```
POST http://localhost:8080/api/login HTTP/1.1
Content-Type: application/json

{
  "email": "SteveOne",
  "password": "SteveOnePassword"
}
```

The value of email is the email address of the user.
The value of password is the password of the user.

Responds in the following form:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 463
ETag: W/"1cf-R9oxjxkSRA4A8/lr+hLJ4pvfEDs"
Date: Mon, 29 Dec 2025 04:27:05 GMT
Connection: close

{
  "id": "5f8bb42f-1372-443e-b287-c8e9dfaca30d",
  "createdAt": "2025-12-28T23:22:56.903Z",
  "updatedAt": "2025-12-28T23:22:56.903Z",
  "email": "SteveOne",
  "isChirpyRed": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiI1ZjhiYjQyZi0xMzcyLTQ0M2UtYjI4Ny1jOGU5ZGZhY2EzMGQiLCJpYXQiOjE3NjY5ODI0MjUsImV4cCI6MTc2Njk4NjAyNX0.kR56n_sk7khkpB0qgy1FVUkydYoaj7KDjOmsCGcYg9M",
  "refreshToken": "25d753af1ee5af23f707c128baf7ca6c24b53878f045ea051c1e7bd0ce78ee8b"
}
```

## POST /api/refresh

Function - Get a new Access Token with a valid Refresh Token.

Takes an HTTP POST request in the following form:

```
POST http://localhost:8080/api/refresh HTTP/1.1
Content-Type: application/json
Authorization: Bearer 25d753af1ee5af23f707c128baf7ca6c24b53878f045ea051c1e7bd0ce78ee8b
```

Responds in the following form:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 220
ETag: W/"dc-6tynOP3o9+CZmWu8BWEiNFVLd/c"
Date: Mon, 29 Dec 2025 04:32:54 GMT
Connection: close

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiI1ZjhiYjQyZi0xMzcyLTQ0M2UtYjI4Ny1jOGU5ZGZhY2EzMGQiLCJpYXQiOjE3NjY5ODI3NzQsImV4cCI6MTc2Njk4NjM3NH0.Ejnu4fR48wO_XiWtOnXrHl3pzl-yq9fvYL71pKJle_0"
}
```

## POST /api/revoke

Function - Revoke a refresh token's authorization.

Takes an HTTP POST request in the following form:

```
POST http://localhost:8080/api/revoke HTTP/1.1
Authorization: Bearer ddb24a8e1671ec1630e4dff8288ee294eb3dc614f0d354ce070ad5927d04e734
```

Responds in the following form:

```
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Mon, 29 Dec 2025 05:14:09 GMT
Connection: close
```

## POST /api/polka/webhooks

Function - Elevate users to Chirpy Red, mimicing a payment processor

Takes an HTTP POST request in the following form:

```
POST http://localhost:8080/api/polka/webhooks HTTP/1.1
Content-Type: application/json
Authorization: ApiKey f271c81ff7084ee5b99a5091b42d486e

{
  "event": "user.upgraded",
  "data": {
    "userId": "5f8bb42f-1372-443e-b287-c8e9dfaca30d"
  }
}
```

The API key in this example is for a fake company, so it is left in the open, but it is a secret that should be in the .env file

The value of event is the type of event sent to the webhook.
The value of userId is the id of the user to elevate to Chirpy Red.

Responds in the following form:

```
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Mon, 29 Dec 2025 05:31:35 GMT
Connection: close
```

## POST /admin/metrics

Function - Check the visitor count history.

Takes an HTTP POST request in the following form:

```
GET http://localhost:8080/admin/metrics HTTP/1.1
```

Responds in the following form:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 112
ETag: W/"70-gV6xPSY3fxeRddDY48h5kG+hNBM"
Date: Mon, 29 Dec 2025 04:18:23 GMT
Connection: close

<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited 0 times!</p>
  </body>
</html>
```

## POST /admin/reset

Function - Deletes all rows in the Database

Takes an HTTP POST request in the following form:

```
POST http://localhost:8080/admin/reset HTTP/1.1
```

Responds in the following form:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 18
ETag: W/"12-3skoXyGhO+mdRiOF0FJAqgxH8E4"
Date: Mon, 29 Dec 2025 04:13:14 GMT
Connection: close

Server Data Reset.
```