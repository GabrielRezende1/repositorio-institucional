// import the multer module before configuring it to use the disc storage engine
const fs = require('fs');
const util = require("util");
const multer = require("multer");
const maxSize = 4 * 1024 * 1024; //4 MB
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "../../db/documents"); // /resources/static/assets/uploads/
    },
//If filename already exists, use filename(1), filename(2)...
    filename: (req, file, cb) => {
        let i = 0;
        if (fs.existsSync(__basedir + "../../db/documents/" + file.originalname)) {
            i++;
            console.log(file.originalname.replace(".pdf", "") + `(${i}).pdf`);
            while (fs.existsSync(__basedir + "../../db/documents/" + file.originalname.replace(".pdf", `(${i}).pdf`))) {
                i++;
                console.log("while: " + i);
            }
        }

        if (i !== 0) {
            file.originalname = file.originalname.replace(".pdf", `(${i}).pdf`);
            console.log('Nome do arquivo: ' + file.originalname);
            cb(null, file.originalname);
            return;
        }
        console.log('Nome do arquivo: ' + file.originalname);
        cb(null, file.originalname);
    }
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("arquivo");

// create the exported middleware object
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
