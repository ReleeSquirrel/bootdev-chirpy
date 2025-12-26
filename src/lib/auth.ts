import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { BadRequestError } from "../errors.js";

/**
 * Creates a Hash from a given password using argon2
 * @param password The password to hash
 * @returns A hash of the password, or an empty string on failure
 */
export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        if (err instanceof Error) console.log(`Notice: Password hashing failed with error ${err.message}`);
        else console.log(`Notice: Password hashing failed with error ${err}`);
        return "";
    }
}

/**
 * Tests if a password matches a given hash using argon2
 * @param password The password to test against the hash
 * @param hash The hash to test the password against
 */
export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) return true;
        else return false;
    } catch (err) {
        if (err instanceof Error) console.log(`Notice: Password hash comparison failed with error ${err.message}`);
        else console.log(`Notice: Password hash comparison failed with error ${err}`);
        return false;
    }
}

function isJwtPayload(value: unknown): value is JwtPayload {
    return typeof value === "object" && value !== null;
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type Payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;
    const iat = Math.floor(Date.now() / 1000);

    try {
        const resultJWT = jwt.sign({
            iss: "chirpy",
            sub: userID,
            iat: iat,
            exp: iat + expiresIn,
        } satisfies Payload, secret);
        return resultJWT;
    } catch (err) {
        if (err instanceof Error) console.log(`Error: ${err.message}`);
        else console.log(`Error: ${err}`);
        if (err instanceof Error) throw err;
        else throw new Error(`Error: ${err}`);
    }
}

export async function validateJWT(tokenString: string, secret: string): Promise<string> {
    try {
        const verifiedJWT = jwt.verify(tokenString, secret);
        if (isJwtPayload(verifiedJWT) && typeof verifiedJWT.sub === "string") {
            return verifiedJWT.sub;
        } else if (typeof verifiedJWT === "string") {
            return verifiedJWT;
        } else throw new BadRequestError('Invalid JWT.');
    } catch (err) {
        throw new BadRequestError('Invalid JWT.');
    }
}

export function getBearerToken(req: Request): string {
    const token = req.get("Authorization");

    if (typeof token !== "string" || !token.startsWith("Bearer ")) {
        throw new BadRequestError("Missing or Malformed Authorization Header");
    }

    return token.replace("Bearer ", "");
}