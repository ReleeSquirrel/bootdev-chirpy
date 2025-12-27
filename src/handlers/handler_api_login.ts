import { NextFunction, Request, Response } from "express";
import { NewUser, NewRefreshToken } from "../lib/db/schema.js";
import { getUserByEmail } from "../lib/db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../lib/auth.js";
import { UnauthorizedError } from "../errors.js";
import { config } from "../config.js";
import { createRefreshToken } from "../lib/db/queries/refresh_tokens.js";

export async function handlerLogin(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "email": string;
        "password": string;
    }

    type Output = {
        "id": string | undefined,
        "createdAt": Date | undefined,
        "updatedAt": Date | undefined,
        "email": string,
        "token": string,
        "refreshToken": string
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
    if (!await checkPasswordHash(input.password, checkUser.hashedPassword)) 
        throw new UnauthorizedError(`Incorrect email or password.`);

    // !! User is Validated after this point !!

    // Create JWT Access Token
    const newJWT = makeJWT(checkUser.id, 3600, config.apiConfig.jwtSecret);

    // Create Refresh Token
    const newRefreshToken = await createRefreshToken({
        userId: checkUser.id,
        token: makeRefreshToken(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    } satisfies NewRefreshToken);

    // Return the user's data
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({
        "id": checkUser.id,
        "createdAt": checkUser.createdAt,
        "updatedAt": checkUser.updatedAt,
        "email": checkUser.email,
        "token": newJWT,
        "refreshToken": newRefreshToken.token
    } satisfies Output));
    return;
};