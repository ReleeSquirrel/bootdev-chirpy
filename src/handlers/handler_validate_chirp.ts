import { NextFunction, Request, Response } from "express";

export function handlerValidateChirp(req: Request, res: Response, next: NextFunction) {
    type Chirp = {
        "body": string,
    }

    const body: Chirp = req.body;

    if (typeof body === "object"
        && body !== null
        && typeof body.body === "string"
    ) {
        if (body.body.length > 140) {
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify({
                "error": "Chirp is too long",
            }));
        } else {
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify({
                "valid": true,
            }));
        }
    } else {
        res.header("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": "Chirp doesn't match accepted JSON format",
        }));
    }
}