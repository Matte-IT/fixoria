const router = require("express").Router();
const upload = require("../middlewares/upload");

const { createProduct } = require("../controllers/product/createProducts");
const { getProductType } = require("../controllers/product/getProductType");
const { getAllProducts } = require("../controllers/product/getAllProducts");

// Add `upload.single('image')` middleware for handling image uploads
router.post("/", upload.single("image"), createProduct);

router.get("/type", getProductType);

router.get("/all", getAllProducts);

module.exports = router;
