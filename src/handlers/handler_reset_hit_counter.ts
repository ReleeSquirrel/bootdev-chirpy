import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export function handlerResetHitCounter(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits = 0;
    res.set('Content-Type', 'text/plain');
    res.send(Buffer.from(`Hit Counter Reset.`));
}