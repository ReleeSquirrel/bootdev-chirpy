import { config } from "../config.js";
export function handlerResetHitCounter(req, res, next) {
    config.fileserverHits = 0;
    res.set('Content-Type', 'text/plain');
    res.send(Buffer.from(`Hit Counter Reset.`));
    next();
}
