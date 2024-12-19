const router = require("express").Router();

const {
  createSalesOrder,
} = require("../controllers/sales-orders/createSalesOrder");

router.post("/", createSalesOrder);

module.exports = router;
