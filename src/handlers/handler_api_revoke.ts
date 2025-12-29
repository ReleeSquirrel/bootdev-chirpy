import { NextFunction, Request, Response } from "express";
import { getBearerToken, makeJWT } from "../lib/auth.js";
import { getRefreshToken, setRefreshTokenRevoked } from "../lib/db/queries/refresh_tokens.js";
import { UnauthorizedError } from "../errors.js";


export async function handlerRevoke(req: Request, res: Response, next: NextFunction) {
    // Check Authorization Header
    const bearerToken = getBearerToken(req);

    // Validate Refresh Token
    const refreshTokenMatch = await getRefreshToken(bearerToken);

    // If token doesn't exist, was revoked, or if it's past the expiry time
    if (refreshTokenMatch === undefined ||
        refreshTokenMatch.revokedAt ||
        refreshTokenMatch.expiresAt.getTime() <= Date.now()
    ) throw new UnauthorizedError(`Unauthorized.`);

    // Revoke the Refresh Token in the database
    await setRefreshTokenRevoked(refreshTokenMatch.token);

    res.status(204).send();
    return;
}