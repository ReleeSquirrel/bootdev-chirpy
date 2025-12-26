import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export async function handlerHitCounter(req: Request, res: Response, next: NextFunction) {
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.apiConfig.fileserverHits} times!</p>
  </body>
</html>`));
}