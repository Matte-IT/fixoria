const express = require("express");
const router = express.Router();
const upload = require("../file-middleware/upload");
const { createAnExpense } = require("../controllers/expense/createAnExpense");
const { getAllExpenses } = require("../controllers/expense/getAllExpenses");
const { getAnExpense } = require("../controllers/expense/getAnExpense");
const { updateAnExpense } = require("../controllers/expense/updateAnExpense");
const { deleteAnExpense } = require("../controllers/expense/deleteAnExpense");

// Create expense
router.post("/", upload.single("file"), createAnExpense);

// Get all expenses
router.get("/", getAllExpenses);

// Get single expense
router.get("/:id", getAnExpense);

// Update expense
router.put("/:id", updateAnExpense);

// Delete expense
router.delete("/:id", deleteAnExpense);

module.exports = router;
