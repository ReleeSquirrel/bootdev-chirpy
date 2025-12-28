import { NextFunction, Request, Response } from "express";
import { NewUser } from "../lib/db/schema.js";
import { createUser, updatePasswordAndEmailByUserId } from "../lib/db/queries/users.js";
import { hashPassword } from "../lib/auth.js";
import { BadRequestError } from "../errors.js";
import { getBearerToken, validateJWT } from "../lib/auth.js";
import { config } from "../config.js";

export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "email": string;
        "password": string;
    }

    type Output = Omit<NewUser, "hashedPassword">;

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

    // Create the new user in the database
    const createdUser: NewUser = await createUser({
        email: input.email,
        hashedPassword: await hashPassword(input.password),
    } satisfies NewUser);

    if(createUser === undefined) throw new BadRequestError(`New user not created.`);

    // Return the new user's data
    res.header("Content-Type", "application/json");
    res.status(201).send(JSON.stringify({
        "id": createdUser.id,
        "createdAt": createdUser.createdAt,
        "updatedAt": createdUser.updatedAt,
        "email": createdUser.email
    } satisfies Output));
    return;
}

export async function handlerUpdateUserPasswordAndEmail(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "email": string;
        "password": string;
    }

    type Output = {
        "email": string;
        "id": string;
        "created_at": Date;
        "updated_at": Date;
    }

    const userID = await validateJWT(getBearerToken(req), config.apiConfig.jwtSecret);
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

    // Update the Password and Email on the Database
    const updatedUser = await updatePasswordAndEmailByUserId(userID, await hashPassword(input.password), input.email);

    // Respond with success and the updatedUser
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({
        "id": updatedUser.id,
        "created_at": updatedUser.createdAt,
        "updated_at": updatedUser.updatedAt,
        "email": updatedUser.email
    } satisfies Output));
}