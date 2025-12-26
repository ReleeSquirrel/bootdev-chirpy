import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError } from "../errors.js";
import { getBearerToken, validateJWT } from "../lib/auth.js";
import { createChirp, getAllChirps, getChirpById } from "../lib/db/queries/chirps.js";
import { NewChirp } from "../lib/db/schema.js";

export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "body": string;
    };

    const userID = await validateJWT(getBearerToken(req), config.apiConfig.jwtSecret);
    const input: Input = req.body;

    // Validate the Input
    if (!(typeof input === "object"
        && input !== null
        && typeof input.body === "string"
    )) {
        res.header("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": "Input doesn't match accepted JSON format.",
        }));
        return;
    }

    // Test if Chirp is Too Long
    if (input.body.length > 140) {
        throw new BadRequestError(`Chirp is too long. Max length is 140`);
    }

    // Censor Chirp
    const censored_body = input.body.split(` `).map((entry) => ["kerfuffle", "sharbert", "fornax"].includes(entry.toLowerCase()) ? "****" : entry).join(` `);

    // Create the Chirp on the database
    const newChirp = await createChirp({
        "body": input.body,
        "userId": userID,
    } satisfies NewChirp);

    // Return
    res.header("Content-Type", "application/json");
    res.status(201).send(JSON.stringify(newChirp));
    return;
}

export async function handlerGetChirp(req: Request, res: Response, next: NextFunction) {
    const chirp: NewChirp = await getChirpById(req.params.chirpID);

    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(chirp));
    return;
}

export async function handlerGetAllChirps(req: Request, res: Response, next: NextFunction) {
    const allChirps: NewChirp[] = await getAllChirps();

    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(allChirps));
    return;
}

