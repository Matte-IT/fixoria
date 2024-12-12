const router = require("express").Router();
const { createSales } = require("../controllers/sales/createSale");

router.post("/", createSales);

module.exports = router;
