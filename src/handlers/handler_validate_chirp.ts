import { NextFunction, Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response, next: NextFunction) {
    type Chirp = {
        "body": string,
    }

    const body: Chirp = req.body;

    // Validate the Chirp
    if (!(typeof body === "object"
        && body !== null
        && typeof body.body === "string"
    )) {
        res.header("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": "Chirp doesn't match accepted JSON format",
        }));
        return;
    }

    // Test if Chirp is Too Long
    if (body.body.length > 140) {
        throw new Error(`Error: Chirp is too long`);
        res.header("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": "Chirp is too long",
        }));
        return;
    }

    // Censor Chirp
    const censored_body = body.body.split(` `).map((entry) => ["kerfuffle", "sharbert", "fornax"].includes(entry.toLowerCase()) ? "****" : entry).join(` `);

    // Return 
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({
        "cleanedBody": censored_body,
    }));
    return;
}