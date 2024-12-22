const pool = require("../../config/database");

const createAnExpense = async (req, res) => {
  const {
    expense_date,
    total_amount,
    grand_total,
    notes,
    is_deleted,
    uploaded_file_path,
    expenseDetails,
  } = req.body;

  // Validate that expenseDetails is not empty and contains at least one valid expense_item_id
  if (!expenseDetails || expenseDetails.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one expense item is required." });
  }

  for (let detail of expenseDetails) {
    if (!detail.expense_item_id) {
      return res
        .status(400)
        .json({
          error: "Expense item ID is required for all expense details.",
        });
    }
  }

  const client = await pool.connect(); // Get a client from the connection pool

  try {
    // Start a transaction
    await client.query("BEGIN");

    // Insert into the purchase.expense table
    const result = await client.query(
      `INSERT INTO purchase.expense (expense_date, total_amount, grand_total, notes, is_deleted, uploaded_file_path, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING expense_id`,
      [
        expense_date,
        total_amount,
        grand_total,
        notes,
        is_deleted || false,
        uploaded_file_path,
      ]
    );

    const expense_id = result.rows[0].expense_id;

    // Insert each item from expenseDetails into purchase.expense_details table
    for (let detail of expenseDetails) {
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
    res
      .status(201)
      .json({ message: "Expense created successfully", expense_id });
  } catch (error) {
    // If an error occurs, rollback the transaction
    await client.query("ROLLBACK");
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

module.exports = { createAnExpense };
