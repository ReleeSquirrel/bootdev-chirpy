import { NextFunction, Request, Response } from "express";
import { updateUpgradeUserToChirpyRedByUserId } from "../lib/db/queries/users.js";
import { getAPIKey } from "../lib/auth.js";
import { config } from "../config.js";
import { BadRequestError, UnauthorizedError } from "../errors.js";

export async function handlerPolkaUserUpgraded(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "event": string;
        "data": {
            "userId": string;
        };
    };

    // Check API Key
    const apiKey = getAPIKey(req);
    if (apiKey !== config.apiConfig.polkaAPIKey) throw new UnauthorizedError(`Unauthorized Webhook Access`);

    const rawInput = req.body;

    // Validate Input
    if( typeof rawInput !== "object" ||
        rawInput === null ||
        typeof (rawInput as any).event !== "string" ||
        typeof (rawInput as any).data !== "object" ||
        (rawInput as any) === null ||
        typeof (rawInput as any).data.userId !== "string"
    ) throw new BadRequestError(`Input doesn't match expected JSON format.`);

    const input: Input = rawInput;

    if(input.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    
    const updateResult = await updateUpgradeUserToChirpyRedByUserId(input.data.userId);

    if (updateResult) {
        res.status(204).send();
        return;
    } else {
        res.status(404).send();
        return;
    }
}