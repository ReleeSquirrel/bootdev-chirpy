import { NextFunction, Request, Response } from "express";
import { NewUser } from "../lib/db/schema.js";
import { getUserByEmail } from "../lib/db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../lib/auth.js";
import { UnauthorizedError } from "../errors.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "email": string;
        "password": string;
        "expiresInSeconds"?: number;
    }

    type Output = {
        "id": string | undefined,
        "createdAt": Date | undefined,
        "updatedAt": Date | undefined,
        "email": string,
        "token": string
    };

    const input: Input = req.body;

    // Validate the Input
    if (!(typeof input === "object"
        && input !== null
        && typeof input.email === "string"
        && typeof input.password === "string"
    )) {
        res.header("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": "Input doesn't match accepted JSON format.",
        }));
        return;
    }

    console.log(`input has been verified, and email is ${input.email}`);

    // Get the record for that user, including their hashed password
    const checkUser: NewUser = await getUserByEmail(input.email);

    // Validate checkUser
    if (typeof checkUser !== "object" ||
        typeof checkUser.email !== "string" ||
        typeof checkUser.id !== "string" ||
        typeof checkUser.hashedPassword !== "string") {
        throw new UnauthorizedError(`Incorrect email or password.`);
    }

    // Check password
    if (!await checkPasswordHash(input.password, checkUser.hashedPassword)) throw new UnauthorizedError(`Incorrect email or password.`);

    // Create JWT
    const newJWT = makeJWT(checkUser.id, input.expiresInSeconds !== undefined && input.expiresInSeconds < 3600 ? input.expiresInSeconds : 3600, config.apiConfig.jwtSecret);

    // Return the user's data
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({
        "id": checkUser.id,
        "createdAt": checkUser.createdAt,
        "updatedAt": checkUser.updatedAt,
        "email": checkUser.email,
        "token": newJWT,
    } satisfies Output));
    return;
};