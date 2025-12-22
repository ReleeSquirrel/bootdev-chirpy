export function middlewareErrorHandler(err, req, res, next) {
    console.log(`Error: ${err.message}`);
    res.header("Content-Type", "application/json");
    res.status(500).send(JSON.stringify({
        "error": "Something went wrong on our end",
    }));
}
