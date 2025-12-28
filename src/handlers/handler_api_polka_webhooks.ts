import { NextFunction, Request, Response } from "express";
import { updateUpgradeUserToChirpyRedByUserId } from "../lib/db/queries/users.js";

export async function handlerPolkaUserUpgraded(req: Request, res: Response, next: NextFunction) {
    type Input = {
        "event": string;
        "data": {
            "userId": string;
        };
    };

    const input: Input = req.body;

    if(input.event != "user.upgraded") {
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