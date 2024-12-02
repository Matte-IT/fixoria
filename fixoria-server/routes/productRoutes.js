const router = require("express").Router();

const { createProduct } = require("../controllers/product/createProducts");
const { getProductType } = require("../controllers/product/getProductType");

router.post("/", createProduct).get("/type", getProductType);

module.exports = router;
