const router = require("express").Router();

const {
  createSalesOrder,
} = require("../controllers/sales-orders/createSalesOrder");
const {
  getAllSalesOrders,
} = require("../controllers/sales-orders/getAllSalesOrders");
const {
  getSingleSalesOrder,
} = require("../controllers/sales-orders/getSingleSalesOrder");
const {
  updateSalesOrder,
} = require("../controllers/sales-orders/updateSalesOrder");

router
  .get("/", getAllSalesOrders)
  .get("/:id", getSingleSalesOrder)
  .put("/:id", updateSalesOrder)
  .post("/", createSalesOrder);

module.exports = router;
