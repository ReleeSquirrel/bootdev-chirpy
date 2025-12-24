import { NextFunction, Request, Response } from "express";
import { getAllChirps } from "../lib/db/queries/chirps.js";
import { NewChirp } from "../lib/db/schema.js";

export async function handlerGetAllChirps(req: Request, res: Response, next: NextFunction) {
    const allChirps: NewChirp[] = await getAllChirps();
    
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(allChirps));
    return;
}