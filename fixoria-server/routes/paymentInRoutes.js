const router = require("express").Router();
const upload = require("../file-middleware/upload");
const createPaymentIn = require("../controllers/payment-in/createPaymentIn");
const getAllPaymentIn = require("../controllers/payment-in/getAllPaymentIn");
const getAPaymentIn = require("../controllers/payment-in/getAPaymentIn");
const deletePaymentIn = require("../controllers/payment-in/deletePaymentIn");
const updatePaymentIn = require("../controllers/payment-in/updatePaymentIn");

router.get("/", getAllPaymentIn);
router.get("/:id", getAPaymentIn);
router.post("/", upload.single("file"), createPaymentIn);
router.put("/:id", upload.single("file"), updatePaymentIn);
router.delete("/:id", deletePaymentIn);

module.exports = router;
