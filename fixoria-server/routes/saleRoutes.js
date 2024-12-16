const router = require("express").Router();

const { createSales } = require("../controllers/sales/createSale");
const { getAllSales } = require("../controllers/sales/getAllSales");
const { getSingleSale } = require("../controllers/sales/getSingleSale");
const { updateSale } = require("../controllers/sales/updateSale");

router
  .get("/", getAllSales)
  .get("/:id", getSingleSale)
  .put("/:id", updateSale)
  .post("/", createSales);

module.exports = router;
