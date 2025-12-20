import express from "express";
import { handlerReadiness } from "./handlers/handler_readiness.js";
import { middlewareLogResponses } from "./middleware/middleware_log_responses.js";
import { middlewareMetricsInc } from "./middleware/middleware_metrics_inc.js";
import { handlerHitCounter } from "./handlers/handler_hit_counter.js";
import { handlerResetHitCounter } from "./handlers/handler_reset_hit_counter.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerHitCounter);
app.get("/admin/reset", handlerResetHitCounter);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
