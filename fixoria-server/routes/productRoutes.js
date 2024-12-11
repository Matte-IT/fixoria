const router = require("express").Router();
const upload = require("../middlewares/upload");

const { createProduct } = require("../controllers/product/createProducts");
const { getProductType } = require("../controllers/product/getProductType");

// Add `upload.single('image')` middleware for handling image uploads
router.post("/", upload.single("image"), createProduct);

router.get("/type", getProductType);

module.exports = router;
