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
async function getApresentacao(req, res) {
    try {
        const data = homeService.getApresentacao();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET /faq - Get FAQ page
 */
async function getFAQ(req, res) {
    try {
        const data = homeService.getFAQ();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getHome,
    getApresentacao,
    getFAQ
};
