import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../lib/db/queries/users.js";

export async function handlerReset(req: Request, res: Response, next: NextFunction) {
    if (config.apiConfig.platform !== "dev") {
        res.status(403).send(JSON.stringify({
            "error": "Forbidden.",
        }));
        return;
    }

    // Reset config
    config.apiConfig.fileserverHits = 0;

    // Reset database
    await deleteAllUsers();

    res.set('Content-Type', 'text/plain');
    res.send(Buffer.from(`Server Data Reset.`));
}