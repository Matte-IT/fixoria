const pool = require("../../config/database");

const updateAnExpense = async (req, res) => {
  const { id } = req.params; // Get expense_id from the route parameters
  const {
    expense_date,
    total_amount,
    grand_total,
    notes,
    is_deleted,
    uploaded_file_path,
    expenseDetails,
  } = req.body;

  const client = await pool.connect(); // Get a client from the connection pool

  try {
    // Start a transaction
    await client.query("BEGIN");

    // Update the purchase.expense table
    await client.query(
      `UPDATE purchase.expense
       SET 
         expense_date = $1,
         total_amount = $2,
         grand_total = $3,
         notes = $4,
         is_deleted = $5,
         uploaded_file_path = $6,
         updated_at = CURRENT_TIMESTAMP
       WHERE 
         expense_id = $7`,
      [
        expense_date,
        total_amount,
        grand_total,
        notes,
        is_deleted || false,
        uploaded_file_path,
        id,
      ]
    );

    // Delete existing details for the expense
    await client.query(
      `DELETE FROM purchase.expense_details WHERE expense_id = $1`,
      [id]
    );

    // Insert updated expenseDetails
    for (let detail of expenseDetails) {
      const { expense_item_id, quantity, price, total } = detail;

      await client.query(
        `INSERT INTO purchase.expense_details (expense_id, expense_item_id, quantity, price, total, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [id, expense_item_id, quantity, price, total]
      );
    }

    // Commit the transaction
    await client.query("COMMIT");

    res.status(200).json({ message: "Expense updated successfully" });
  } catch (error) {
    // Rollback the transaction in case of an error
    await client.query("ROLLBACK");
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

module.exports = { updateAnExpense };
