import { NextFunction, Request, Response } from "express";
import { getBearerToken, makeJWT } from "../lib/auth.js";
import { getRefreshToken } from "../lib/db/queries/refresh_tokens.js";
import { UnauthorizedError } from "../errors.js";
import { config } from "../config.js";


export async function handlerRefresh(req: Request, res: Response, next: NextFunction) {
    type Output = {
        token: string;
    };

    // Check Authorization Header
    const bearerToken = getBearerToken(req);

    // Validate Refresh Token
    const refreshTokenMatch = await getRefreshToken(bearerToken);

    // If token doesn't exist, was revoked, or if it's past the expiry time
    if (refreshTokenMatch === undefined ||
        refreshTokenMatch.revokedAt ||
        refreshTokenMatch.expiresAt.getTime() <= Date.now()
    ) throw new UnauthorizedError(`Unauthorized.`);

    // Create JWT Access Token
    const newJWT = makeJWT(refreshTokenMatch.userId, 3600, config.apiConfig.jwtSecret);

    // Respond with a new JWT Access Token
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({
        token: newJWT,
    } satisfies Output));
    return;
}