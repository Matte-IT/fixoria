const pool = require("../../config/database");

const deleteAnExpense = async (req, res) => {
  const { id } = req.params; // Get expense_id from the route parameters
  const client = await pool.connect(); // Get a client from the connection pool

  try {
    // Update the is_deleted field to true
    const deleteQuery = `
      UPDATE purchase.expense
      SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
      WHERE expense_id = $1
      RETURNING expense_id;
    `;

    const result = await client.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Return success message
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

module.exports = { deleteAnExpense };
