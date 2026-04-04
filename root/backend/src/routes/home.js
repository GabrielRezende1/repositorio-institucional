const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

/**
 * /
 * /apresentacao
 * /faq
 */

// GET home - Document types and search
router.get("/", homeController.getHome);

// GET /apresentacao - Institutional presentation
router.get("/apresentacao", homeController.getApresentacao);

// GET /faq - FAQ information
router.get("/faq", homeController.getFAQ);

module.exports = router;
