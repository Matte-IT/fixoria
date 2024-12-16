const router = require("express").Router();
const { createSales } = require("../controllers/sales/createSale");
const { getAllSales } = require("../controllers/sales/getAllSales");

router.get("/", getAllSales).post("/", createSales);

module.exports = router;
