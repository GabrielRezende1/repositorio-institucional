const express = require("express");
const router = express.Router();
const productCtrl = require('../controllers/product')
//const db = require("../db/models/index");

router.get("/", productCtrl.getAllProducts);

router.get("/:id", productCtrl.getProductById);

router.post("/", productCtrl.newProduct);

router.delete("/:id", productCtrl.deleteProductById);

router.put("/:id", productCtrl.changeProduct);

module.exports = router;
