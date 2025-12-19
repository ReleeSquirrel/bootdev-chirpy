import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export function handlerHitCounter(req: Request, res: Response, next: NextFunction) {
    res.set('Content-Type', 'text/plain');
    res.send(Buffer.from(`Hits: ${config.fileserverHits}`));
    next();
}