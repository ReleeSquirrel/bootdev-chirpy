export function handlerValidateChirp(req, res, next) {
    let body = "";
    // Read from the input stream on data events and add it to the body
    req.on("data", (chunk) => {
        body += chunk;
    });
    // On end event, parse and validate the input
    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);
            // Validate the input
            if (typeof parsedBody === "object" &&
                parsedBody !== null &&
                typeof parsedBody.body === "string") {
                if (parsedBody.body.length > 140) {
                    res.header("Content-Type", "application/json");
                    res.status(400).send(JSON.stringify({
                        "error": "Chirp is too long",
                    }));
                }
                else {
                    res.header("Content-Type", "application/json");
                    res.status(200).send(JSON.stringify({
                        "valid": true,
                    }));
                }
            }
        }
        catch (err) {
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify({
                "error": "Something went wrong",
            }));
        }
    });
}
