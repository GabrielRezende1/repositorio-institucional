let jwt = require('jsonwebtoken');
let authSecret = "jwtSecret";

module.exports = function(req, res, next) {
    let token = req.body.token;

    if(token != undefined) {
        jwt.verify(token, authSecret, (err, data) => {
            if(err) {
                res.statusCode = 403;
                res.json({err: 'token inválido1'});
            }else {
                console.log(data);
                next();
            }
        })
    }else {
        res.statusCode = 403;
        res.json({err: 'token inválido2'});
    }
}