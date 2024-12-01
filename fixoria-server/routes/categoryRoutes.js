const router = require("express").Router();
const { createCategory } = require("../controllers/category/createCategory");
const {
  getAllCategories,
} = require("../controllers/category/getAllCategories");

// Create Category
router
  .post("/", createCategory)

  // Get All Categories
  .get("/", getAllCategories);

module.exports = router;
