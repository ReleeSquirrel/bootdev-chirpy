process.loadEnvFile(`.env`);

const env = process.env;
if (!env || !env.DB_URL) throw new Error(`Error: Missing .env file.`);
export const dbURL = env.DB_URL;


type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

export const config: APIConfig = {
    fileserverHits: 0,
    dbURL: dbURL,
}