import { NextFunction, Request, Response } from "express";
import { getChirpById } from "../lib/db/queries/chirps.js";
import { NewChirp } from "../lib/db/schema.js";

export async function handlerGetChirp(req: Request, res: Response, next: NextFunction) {
    const chirp: NewChirp = await getChirpById(req.params.chirpID);
    
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(chirp));
    return;
}