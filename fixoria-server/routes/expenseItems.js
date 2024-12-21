const router = require("express").Router();

const {
  createAnExpenseItem,
} = require("../controllers/expense-items/createAnExpenseItem");

const {
  readAllExpenseItems,
} = require("../controllers/expense-items/readAllExpenseItems");

const {
  readAnExpenseItem,
} = require("../controllers/expense-items/readAnExpenseItem");

const {
  updateAnExpenseItem,
} = require("../controllers/expense-items/updateAnExpenseItem");

const {
  deleteAnExpenseItem,
} = require("../controllers/expense-items/deleteAnExpenseItem");

router
  .post("/", createAnExpenseItem)
  .get("/", readAllExpenseItems)
  .get("/:id", readAnExpenseItem)
  .put("/:id", updateAnExpenseItem)
  .delete("/:id", deleteAnExpenseItem);

module.exports = router;
