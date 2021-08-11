const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        
        // token_created = token.slice(1,197)
        token_created = token.slice(4, token.length - 1)
        console.log(token_created)
        jwt.verify(token_created, "Key", (err, user) => {
            if (err) {
                // res.sendStatus(404);
                res.send("not verified")

            }
            else {
                req.user = user;
                console.log("ok")
                next()
            };
        });
    } else {
        res.sendStatus(401);

    }
}
