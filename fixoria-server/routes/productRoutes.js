const router = require("express").Router();
const upload = require("../middlewares/upload");

const { createProduct } = require("../controllers/product/createProducts");
const { getAllProducts } = require("../controllers/product/getAllProducts");
const { getSingleProduct } = require("../controllers/product/getSingleProduct");
const { updateProduct } = require("../controllers/product/updateProduct");

router
  .get("/all", getAllProducts)
  .get("/:id", getSingleProduct)
  .put("/:id", updateProduct)
  // Add `upload.single('image')` middleware for handling image uploads
  .post("/", upload.single("image"), createProduct);

module.exports = router;
