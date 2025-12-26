import { NextFunction, Request, Response } from "express";

export async function handlerReadiness(req: Request, res: Response, next: NextFunction) {
    res.set('Content-Type', 'text/plain');
    res.send(Buffer.from('OK'));
}