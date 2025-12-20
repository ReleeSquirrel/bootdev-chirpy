import { config } from "../config.js";
export function handlerHitCounter(req, res, next) {
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`));
    next();
}
