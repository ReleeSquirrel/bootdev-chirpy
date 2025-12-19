import { config } from "../config.js";
export function handlerHitCounter(req, res, next) {
    res.set('Content-Type', 'text/plain');
    res.send(Buffer.from(`Hits: ${config.fileserverHits}`));
    next();
}
