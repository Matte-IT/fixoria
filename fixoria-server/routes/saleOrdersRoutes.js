const router = require("express").Router();

const {
  createSalesOrder,
} = require("../controllers/sales-orders/createSalesOrder");
const {
  getAllSalesOrders,
} = require("../controllers/sales-orders/getAllSalesOrders");

router.get("/", getAllSalesOrders).post("/", createSalesOrder);

module.exports = router;
