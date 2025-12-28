import express from "express";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { config } from "./config.js";
import { handlerReadiness } from "./handlers/handler_api_healthz.js";
import { middlewareLogResponses } from "./middleware/middleware_log_responses.js";
import { middlewareMetricsInc } from "./middleware/middleware_metrics_inc.js";
import { handlerHitCounter } from "./handlers/handler_admin_metrics.js";
import { handlerReset } from "./handlers/handler_admin_reset.js";
import { middlewareErrorHandler } from "./middleware/middleware_error_handler.js";
import { handlerCreateUser, handlerUpdateUserPasswordAndEmail } from "./handlers/handler_api_users.js";
import { handlerCreateChirp, handlerDeleteChirp } from "./handlers/handler_api_chirps.js";
import { handlerGetAllChirps } from "./handlers/handler_api_chirps.js";
import { handlerGetChirp } from "./handlers/handler_api_chirps.js";
import { handlerLogin } from "./handlers/handler_api_login.js";
import { handlerRefresh } from "./handlers/handler_api_refresh.js";
import { handlerRevoke } from "./handlers/handler_api_revoke.js";
import { handlerPolkaUserUpgraded } from "./handlers/handler_api_polka_webhooks.js";

const migrationClient = postgres(config.dbConfig.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migrationConfig);

const app = express();

app.use(middlewareLogResponses);

app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
  try {
    await handlerReadiness(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post("/api/chirps", async (req, res, next) => {
  try {
    await handlerCreateChirp(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.get("/api/chirps", async (req, res, next) => {
  try {
    await handlerGetAllChirps(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.get("/api/chirps/:chirpID", async (req, res, next) => {
  try {
    await handlerGetChirp(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/chirps/:chirpID", async (req, res, next) => {
  try {
    await handlerDeleteChirp(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post("/api/users", async (req, res, next) => {
  try {
    await handlerCreateUser(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.put("/api/users", async (req, res, next) => {
  try {
    await handlerUpdateUserPasswordAndEmail(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    await handlerLogin(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post("/api/refresh", async (req, res, next) => {
  try {
    await handlerRefresh(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post("/api/revoke", async (req, res, next) => {
  try {
    await handlerRevoke(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post("/api/polka/webhooks", async (req, res, next) => {
  try {
    await handlerPolkaUserUpgraded(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.get("/admin/metrics", async (req, res, next) => {
  try {
    await handlerHitCounter(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.post("/admin/reset", async (req, res, next) => {
  try {
    await handlerReset(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use(middlewareErrorHandler);

app.listen(config.apiConfig.port, () => {
  console.log(`Server is running at http://localhost:${config.apiConfig.port}`);
});