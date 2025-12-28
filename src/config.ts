import type { MigrationConfig } from "drizzle-orm/migrator";

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileserverHits: number;
  platform: string;
  port: number;
  jwtSecret: string;
  polkaAPIKey: string;
};

type Config = {
  dbConfig: DBConfig;
  apiConfig: APIConfig;
};

process.loadEnvFile(`.env`);

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

const env = process.env;

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/lib/db/",
};

const dbConfig: DBConfig = {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
}

const apiConfig: APIConfig = {
  fileserverHits: 0,
  platform: envOrThrow("PLATFORM"),
  port: Number(envOrThrow("PORT")),
  jwtSecret: envOrThrow("SECRET"),
  polkaAPIKey: envOrThrow("POLKA_KEY"),
}

export const config: Config = {
  dbConfig: dbConfig,
  apiConfig: apiConfig,
}