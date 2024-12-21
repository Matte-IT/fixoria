const router = require("express").Router();
const upload = require("../middlewares/upload");

const { createProduct } = require("../controllers/product/createProducts");
const { getAllProducts } = require("../controllers/product/getAllProducts");

router
  .get("/", getAllProducts)
  // Add `upload.single('image')` middleware for handling image uploads
  .post("/", upload.single("image"), createProduct);

module.exports = router;
