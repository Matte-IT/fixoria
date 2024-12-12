const router = require("express").Router();
const { createPurchase } = require("../controllers/purchase/createPurchase");

router.post("/", createPurchase);

module.exports = router;
