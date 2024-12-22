const router = require("express").Router();

const { createAnExpense } = require("../controllers/expense/createAnExpense");
const { deleteAnExpense } = require("../controllers/expense/deleteAnExpense");
const { getAllExpenses } = require("../controllers/expense/getAllExpenses");
const { getAnExpense } = require("../controllers/expense/getAnExpense");
const { updateAnExpense } = require("../controllers/expense/updateAnExpense");

router
  .post("/", createAnExpense)
  .get("/", getAllExpenses)
  .get("/:id", getAnExpense)
  .put("/:id", updateAnExpense)
  .delete("/:id", deleteAnExpense);

module.exports = router;
