import { NextFunction, Request, Response } from "express";
import { NewUser } from "../lib/db/schema.js";
import { createUser } from "../lib/db/queries/users.js";

export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "email": string;
    }

    type Output = {
        "id": string,
        "createdAt": string,
        "updatedAt": string,
        "email": string
    }


    const input: Input = req.body;

    // Validate the Input
    if (!(typeof input === "object"
        && input !== null
        && typeof input.email === "string"
    )) {
        res.header("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": "Input doesn't match accepted JSON format.",
        }));
        return;
    }

    // Create the new user in the database
    const newUser: NewUser = {
        email: input.email,
    }
    const createdUser: NewUser = await createUser(newUser);

    // Return the new user's data
    res.header("Content-Type", "application/json");
    res.status(201).send(JSON.stringify({
        "id": String(createdUser.id),
        "createdAt": String(createdUser.createdAt),
        "updatedAt": String(createdUser.updatedAt),
        "email": createdUser.email
    } satisfies Output));
}