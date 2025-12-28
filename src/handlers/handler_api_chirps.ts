import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors.js";
import { getBearerToken, validateJWT } from "../lib/auth.js";
import { createChirp, deleteChirpById, getAllChirps, getAllChirpsByUserId, getChirpById } from "../lib/db/queries/chirps.js";
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
        "body": censored_body,
        "userId": userID,
    } satisfies NewChirp);

    if (newChirp === undefined) throw new BadRequestError(`New chirp not created.`);

    // Return
    res.header("Content-Type", "application/json");
    res.status(201).send(JSON.stringify(newChirp));
    return;
}

export async function handlerGetChirp(req: Request, res: Response, next: NextFunction) {
    // Get the chirp
    const chirp: NewChirp = await getChirpById(req.params.chirpID);

    // Return the chirp
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(chirp));
    return;
}

export async function handlerGetAllChirps(req: Request, res: Response, next: NextFunction) {
    // Check sort query parameter
    const sort: string = typeof req.query.sort === "string" ? req.query.sort : "asc";

    // Check authorId query parameter
    let rawChirps: NewChirp[];
    if (typeof req.query.authorId === "string") {
        // Get only those chirps with the matching authorId
        rawChirps = await getAllChirpsByUserId(req.query.authorId);
    } else {
        // Get all chirps
        rawChirps = await getAllChirps();
    }

    // Validate all the chirps
    const chirps = rawChirps.filter(
        (r): r is NewChirp & {
            body: string;
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        } =>
            typeof r.body === "string" &&
            typeof r.userId === "string" &&
            typeof r.id === "string" &&
            r.createdAt instanceof Date &&
            r.updatedAt instanceof Date
    );


    // Sort the Chirps by created_at
    if (sort === "asc") chirps.sort((a, b) => a.createdAt?.getTime() - b.createdAt?.getTime());
    if (sort === "desc") chirps.sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime());

    // Return the Chirps
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(chirps));
    return;
}

export async function handlerDeleteChirp(req: Request, res: Response, next: NextFunction) {
    // Check Access Token JWT
    const userID = await validateJWT(getBearerToken(req), config.apiConfig.jwtSecret);

    // Check if the chirp exists and belongs to userID
    const chirp: NewChirp = await getChirpById(req.params.chirpID);
    if (!chirp) throw new NotFoundError(`Chirp not found.`);
    if (chirp.userId != userID) throw new ForbiddenError(`Chirp is not owned by user.`);

    // Delete the Chirp
    await deleteChirpById(req.params.chirpID);

    // Respond with success
    res.status(204).send();
}