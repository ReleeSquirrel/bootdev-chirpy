import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors.js";
import { createChirp } from "../lib/db/queries/chirps.js";
import { NewChirp } from "../lib/db/schema.js";

export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "body": string,
        "userId": string,
    }

    const input: Input = req.body;

    // Validate the Input
    if (!(typeof input === "object"
        && input !== null
        && typeof input.body === "string"
        && typeof input.userId === "string"
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
        "userId": input.userId,
    } satisfies NewChirp);

    // Return
    res.header("Content-Type", "application/json");
    res.status(201).send(JSON.stringify(newChirp));
    return;
}