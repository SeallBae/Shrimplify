const jwt = require("jsonwebtoken");

function authenToken(req, res, next) {
    const authHeader = req.headers.token;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) return res.status(403).json(err);
            req.user = data;
            next();
        });
    } else {
        return res.status(500).json("You are not authenticated!");
    }
}

module.exports = authenToken;