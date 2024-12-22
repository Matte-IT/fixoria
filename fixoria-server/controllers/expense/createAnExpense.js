const pool = require("../../config/database");

const createAnExpense = async (req, res) => {
  try {
    let expenseData;
    try {
      // Check if expenseData exists in body
      if (!req.body.expenseData) {
        return res.status(400).json({
          error: "Missing expense data",
          received: req.body,
        });
      }

      // Parse the expense data
      expenseData = JSON.parse(req.body.expenseData);
    } catch (error) {
      console.error("Parse error:", error);
      return res.status(400).json({
        error: "Invalid expense data format",
        details: error.message,
        received: req.body.expenseData,
      });
    }

    // Validate the parsed data
    if (
      !expenseData ||
      !expenseData.expense_date ||
      !expenseData.total_amount
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["expense_date", "total_amount"],
        received: expenseData,
      });
    }

    // Validate expense details array
    if (!Array.isArray(expenseData.expenseDetails)) {
      return res.status(400).json({
        error: "expenseDetails must be an array",
        received: expenseData.expenseDetails,
      });
    }

    // Validate individual items
    const validDetails = expenseData.expenseDetails.filter(
      (detail) =>
        detail &&
        Number.isInteger(parseInt(detail.expense_item_id)) &&
        !isNaN(parseFloat(detail.quantity)) &&
        !isNaN(parseFloat(detail.price))
    );

    if (validDetails.length === 0) {
      return res.status(400).json({
        error: "At least one valid expense item is required",
        received: expenseData.expenseDetails,
      });
    }

    // Get file path if exists
    const uploaded_file_path = req.file
      ? req.file.path.replace(/\\/g, "/")
      : null;

    // Continue with database operations
    const client = await pool.connect();

    try {
      // Start a transaction
      await client.query("BEGIN");

      // Insert into the purchase.expense table
      const result = await client.query(
        `INSERT INTO purchase.expense (expense_date, total_amount, grand_total, notes, is_deleted, uploaded_file_path, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
               RETURNING expense_id`,
        [
          expenseData.expense_date,
          expenseData.total_amount,
          expenseData.grand_total,
          expenseData.notes,
          expenseData.is_deleted || false,
          uploaded_file_path,
        ]
      );

      const expense_id = result.rows[0].expense_id;

      // Insert each item from validDetails into purchase.expense_details table
      for (let detail of validDetails) {
        const { expense_item_id, quantity, price, total } = detail;

        await client.query(
          `INSERT INTO purchase.expense_details (expense_id, expense_item_id, quantity, price, total, created_at, updated_at)
                   VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [expense_id, expense_item_id, quantity, price, total]
        );
      }

      // Commit the transaction
      await client.query("COMMIT");

      // Return the created expense
      res.status(201).json({
        message: "Expense created successfully",
        expense_id,
        uploaded_file_path,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Database error:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = { createAnExpense };
