const router = require("express").Router();
const { createAPurchaseOrder } = require("../controllers/purchase/createAPurchaseOrder");
const { getAllPurchaseOrders } = require("../controllers/purchase/getAllPurchaseOrders");
const { getSinglePurchaseOrder } = require("../controllers/purchase/getSinglePurchaseOrder");
const { updateSinglePurchaseOrder } = require("../controllers/purchase/updateSinglePurchaseOrder");


router
  .post("/", createAPurchaseOrder)
  .get("/", getAllPurchaseOrders)
  .get("/:id", getSinglePurchaseOrder)
  .put("/:id", updateSinglePurchaseOrder);

module.exports = router;
