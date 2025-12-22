import express from "express";
import { handlerReadiness } from "./handlers/handler_readiness.js";
import { middlewareLogResponses } from "./middleware/middleware_log_responses.js";
import { middlewareMetricsInc } from "./middleware/middleware_metrics_inc.js";
import { handlerHitCounter } from "./handlers/handler_hit_counter.js";
import { handlerResetHitCounter } from "./handlers/handler_reset_hit_counter.js";
import { handlerValidateChirp } from "./handlers/handler_validate_chirp.js";
import { middlewareErrorHandler } from "./middleware/middleware_error_handler.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", async (req, res, next) => {
    try {
        await handlerReadiness(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
app.post("/api/validate_chirp", async (req, res, next) => {
    try {
        await handlerValidateChirp(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
app.get("/admin/metrics", async (req, res, next) => {
    try {
        await handlerHitCounter(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerResetHitCounter(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
app.use(middlewareErrorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
