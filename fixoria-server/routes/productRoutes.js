const router = require("express").Router();
const { createProduct } = require("../controllers/product/createProducts");

router.post("/", createProduct);

module.exports = router;
