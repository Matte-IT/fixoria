const router = require("express").Router();
const { createPurchase } = require("../controllers/purchase/createPurchase");
const { getAllPurchases } = require("../controllers/purchase/getAllPurchases");
const {
  getSinglePurchase,
} = require("../controllers/purchase/getSinglePurchase");
const { updateSinglePurchase } = require("../controllers/purchase/updateSinglePurchase");

router
  .post("/", createPurchase)
  .get("/all", getAllPurchases)
  .get("/:id", getSinglePurchase)
  .put("/:id", updateSinglePurchase);

module.exports = router;
