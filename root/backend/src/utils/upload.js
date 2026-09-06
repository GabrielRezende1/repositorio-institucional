// import the multer module before configuring it to use the disc storage engine
const fs = require('fs');
const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024; //10 MB

function normalizeFilename(fileName) {
    const decodedName = Buffer.from(fileName, "latin1").toString("utf8");
    const hasMojibake = /[ÃÂâ€™â€œâ€�]/.test(fileName);
    const normalizedName = hasMojibake && !decodedName.includes("\uFFFD")
        ? decodedName
        : fileName;

    return normalizedName
        .normalize("NFC")
        .replace(/[\\/:?%*|"<>]/g, "_")
        .replace(/[\u0000-\u001F\u007F]/g, "_")
        .replace(/\s+/g, " ")
        .trim();
}

// Document type to storage directory mapping
const DOCUMENT_STORAGE_MAPPING = {
    1: "event_articles/",
    2: "journal_articles/",
    3: "book_chapter/",
    4: "dissertations/",
    5: "books/",
    6: "monographs/",
    7: "theses/",
    8: "final_course_projects/",
    9: "policies/",
    10: "tutorials/"
};

/**
 * Check if file exists in any document type subdirectory
 * @param {string} fileName - File name to check
 * @returns {boolean} True if file exists in any type directory
 */
function fileExistsInTypeDirectories(fileName) {
    for (const typeId in DOCUMENT_STORAGE_MAPPING) {
        const typeDir = DOCUMENT_STORAGE_MAPPING[typeId];
        const filePath = __basedir + `../../storage/${typeDir}${fileName}`;
        if (fs.existsSync(filePath)) {
            return true;
        }
    }
    return false;
}

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Upload all files to generic storage directory (temporary)
        const fullPath = __basedir + "../../storage";
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        
        cb(null, fullPath);
    },
    //If filename already exists in type directories, use filename(1), filename(2)...
    filename: (req, file, cb) => {
        let i = 0;
        const originalName = normalizeFilename(file.originalname);
        
        // Check if file exists in any type-specific directory
        if (fileExistsInTypeDirectories(originalName)) {
            i++;
            const extensionIndex = originalName.toLowerCase().lastIndexOf(".pdf");
            const nameWithoutExtension = extensionIndex === -1
                ? originalName
                : originalName.slice(0, extensionIndex);
            const extension = extensionIndex === -1 ? "" : originalName.slice(extensionIndex);

            while (fileExistsInTypeDirectories(`${nameWithoutExtension}(${i})${extension}`)) {
                i++;
            }

            file.originalname = `${nameWithoutExtension}(${i})${extension}`;
        } else {
            file.originalname = originalName;
        }

        console.log('Nome do arquivo: ' + file.originalname);
        cb(null, file.originalname);
    }
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

// create the exported middleware object
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
