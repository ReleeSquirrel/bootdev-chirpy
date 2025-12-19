export function handlerReadiness(req, res, next) {
    res.set('Content-Type', 'text/plain');
    res.send(Buffer.from('OK'));
    next();
}
