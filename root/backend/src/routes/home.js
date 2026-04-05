const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

/**
 * /
 * /apresentacao
 * /faq
 * /politicas
 * /politicas/:nome
 * /tutorial
 * /tutorial/:nome
 */

// GET home - Document types and search
router.get("/", homeController.getHome);

// GET /apresentacao - Institutional presentation
router.get("/apresentacao", homeController.getPresentation);

// GET /faq - FAQ information
router.get("/faq", homeController.getFAQ);

// GET /politicas - Institutional policies
router.get("/politicas", homeController.getPolicies);

// GET /politicas/:nome - Download policy
router.get("/politicas/:nome", homeController.getPolicyDownload);

// GET /tutorial - Institutional tutorials
router.get("/tutorial", homeController.getTutorials);

// GET /tutorial/:nome - Download tutorial
router.get("/tutorial/:nome", homeController.getTutorialDownload);

module.exports = router;
