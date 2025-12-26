import { NextFunction, Request, Response } from "express";
import { NewUser } from "../lib/db/schema.js";
import { createUser } from "../lib/db/queries/users.js";
import { hashPassword } from "../lib/auth.js";

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