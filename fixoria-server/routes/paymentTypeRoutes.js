const router = require("express").Router();

const {
  getAllPaymentType,
} = require("../controllers/payment-type/getAllPaymentType");

router.get("/", getAllPaymentType);

module.exports = router;
