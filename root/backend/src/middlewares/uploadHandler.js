const uploadFile = require("../utils/upload");

module.exports = async function upload(req, res, next) {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).json({ msg: "Carregue um documento, por favor!" });
        }
        next();
    } catch (err) { // error handling
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).json({
            msg: "Arquivos maiores que 10MB não podem ser carregados!",
            });
        }
        res.status(500).json({
            msg: `Não é possível carregar o arquivo: ${req.file.originalname}. ${err}`,
        });
    }
};