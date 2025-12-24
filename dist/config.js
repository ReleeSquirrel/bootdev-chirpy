process.loadEnvFile(`.env`);
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}
const env = process.env;
const migrationConfig = {
    migrationsFolder: "./src/lib/db/",
};
const dbConfig = {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
};
const apiConfig = {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
    port: Number(envOrThrow("PORT")),
};
export const config = {
    dbConfig: dbConfig,
    apiConfig: apiConfig,
};
