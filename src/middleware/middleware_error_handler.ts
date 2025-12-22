import { NextFunction, Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../errors.js";

export function middlewareErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(`Error: ${err.message}`);
    res.header("Content-Type", "application/json");
    const errorCode = err instanceof BadRequestError ? 400 :
        err instanceof UnauthorizedError ? 401 :
            err instanceof ForbiddenError ? 403 :
                err instanceof NotFoundError ? 404 : 0;

    if (errorCode !== 0) {
        res.status(errorCode).send(JSON.stringify({
            "error": err.message,
        }));
    } else {
        res.status(500).send(JSON.stringify({
            "error": "Something went wrong on our end",
        }));
    }
}