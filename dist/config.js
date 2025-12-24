process.loadEnvFile(`.env`);
const env = process.env;
if (!env || !env.DB_URL)
    throw new Error(`Error: Missing .env file.`);
export const dbURL = env.DB_URL;
export const config = {
    fileserverHits: 0,
    dbURL: dbURL,
};
