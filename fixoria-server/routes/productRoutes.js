const router = require("express").Router();
const upload = require("../middlewares/upload");

const { createProduct } = require("../controllers/product/createProducts");
const { getAllProducts } = require("../controllers/product/getAllProducts");
const { getSingleProduct } = require("../controllers/product/getSingleProduct");

router
  .get("/all", getAllProducts)
  .get("/:id", getSingleProduct)
  // Add `upload.single('image')` middleware for handling image uploads
  .post("/", upload.single("image"), createProduct);

module.exports = router;
