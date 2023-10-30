require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
    const token = req.cookies.token;

    if (token == undefined) return res.status(401).json({ err: "token inválido1", token: token});

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            res.clearCookie('token');
            return res.status(403).json({ msg: "token inválido2", err: err, data: data });
        }
        next();
    });
};
