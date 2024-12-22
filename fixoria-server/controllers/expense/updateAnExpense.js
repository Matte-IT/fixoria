const pool = require("../../config/database");

const updateAnExpense = async (req, res) => {
  try {
    const { id } = req.params;
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
    if (!expenseData || !expenseData.expense_date || !expenseData.total_amount) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["expense_date", "total_amount"],
        received: expenseData,
      });
    }

    // Validate expense details array
    if (!Array.isArray(expenseData.expense_details)) {
      return res.status(400).json({
        error: "expense_details must be an array",
        received: expenseData.expense_details,
      });
    }

    // Get file path if exists
    const uploaded_file_path = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      console.log("Updating expense with data:", expenseData);

      // Update the expense
      await client.query(
        `UPDATE purchase.expense
         SET 
           expense_date = $1,
           total_amount = $2,
           grand_total = $3,
           notes = $4,
           is_deleted = $5,
           uploaded_file_path = COALESCE($6, uploaded_file_path),
           updated_at = CURRENT_TIMESTAMP
         WHERE 
           expense_id = $7`,
        [
          expenseData.expense_date,
          expenseData.total_amount,
          expenseData.grand_total,
          expenseData.notes,
          expenseData.is_deleted || false,
          uploaded_file_path,
          id,
        ]
      );

      // Delete existing expense details
      await client.query(
        `DELETE FROM purchase.expense_details WHERE expense_id = $1`,
        [id]
      );

      // Insert updated expense details
      if (expenseData.expense_details.length === 0) {
        return res.status(400).json({
          error: "At least one item must be selected.",
        });
      }

      for (let detail of expenseData.expense_details) {
        const { expense_item_id, quantity, price, total } = detail;

        if (
          !expense_item_id ||
          !quantity ||
          !price ||
          !total ||
          isNaN(expense_item_id) ||
          isNaN(quantity) ||
          isNaN(price) ||
          isNaN(total)
        ) {
          throw new Error("Invalid expense detail data");
        }

        await client.query(
          `INSERT INTO purchase.expense_details 
           (expense_id, expense_item_id, quantity, price, total, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [id, expense_item_id, quantity, price, total]
        );
      }

      await client.query("COMMIT");

      res.status(200).json({ 
        message: "Expense updated successfully",
        expense_id: id,
        uploaded_file_path: uploaded_file_path || expenseData.uploaded_file_path
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

module.exports = { updateAnExpense };
