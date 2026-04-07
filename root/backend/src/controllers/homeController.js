const homeService = require("../services/homeService");

/**
 * GET / - Get home page with document types
 */
async function getHome(req, res) {
    try {
        const result = await homeService.getDocumentTypes();

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        // If search query exists, redirect to search endpoint
        if (req.query.search !== undefined) {
            return res.redirect(`/api/documento/?search=${req.query.search}`);
        }

        res.status(200).json({ doctypes: result.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET /apresentacao - Get institutional presentation
 */
async function getPresentation(req, res) {
    try {
        const result = homeService.getPresentation();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET /faq - Get FAQ page
 */
async function getFAQ(req, res) {
    try {
        const result = homeService.getFAQ();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET /politicas - Get Politics documents
 */
async function getPolicies(req, res) {
    try {
        const result = await homeService.getPolicies();
        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function getPolicyDownload(req, res) {
    try {
        const fileName = req.params.nome;
        const result = await homeService.getPolicyDownload(fileName);
    
        if (!result.success) {
            return res.status(500).json({error: result.error});
        }
        
        const directoryPath = __basedir + "../../storage/policies/";
        res.download(directoryPath + fileName, fileName, (error) => {
            if (error) {
                return res.status(500).json({error: "File download error. " + error.message});
            }
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function getTutorials(req, res) {
    try {
        const result = await homeService.getTutorial();
        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function getTutorialDownload(req, res) {
    try {
        const fileName = req.params.nome;
        const result = await homeService.getTutorialDownload(fileName);

        if(!result.success) {
            return res.status(500).json({error: result.error});
        }

        const directoryPath = __basedir + "../../storage/tutorials/";
        res.download(directoryPath + fileName, fileName, (error) => {
            if (error) {
                return res.status(500).json({error: "File download error. " + error.message});
            }
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    getHome,
    getPresentation,
    getFAQ,
    getPolicies,
    getPolicyDownload,
    getTutorials,
    getTutorialDownload
};
