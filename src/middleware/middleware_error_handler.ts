import { NextFunction, Request, Response } from "express";

export function middlewareErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(`Error: ${err.message}`);
    res.header("Content-Type", "application/json");
    res.status(500).send(JSON.stringify({
        "error": "Something went wrong on our end",
    }));
}