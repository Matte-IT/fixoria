const pool = require("../../config/database");

const deleteAnExpenseItem = async (req, res) => {
  const { id } = req.params; // Extracting the ID from request parameters

  // Validate the ID
  if (!id) {
    return res.status(400).json({
      error: "Expense item ID is required.",
    });
  }

  try {
    // Check if the item exists and is active
    const checkResult = await pool.query(
      `SELECT * FROM inventory.expense_item WHERE expense_item_id = $1 AND is_active = TRUE`,
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: "Expense item not found or is already inactive.",
      });
    }

    // Update the is_active field to FALSE (soft delete)
    const result = await pool.query(
      `UPDATE inventory.expense_item
       SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
       WHERE expense_item_id = $1
       RETURNING *`,
      [id]
    );

    res.status(200).json({
      message: `${result.rows[0].name} Deleted successfully`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete expense item" });
  }
};

module.exports = { deleteAnExpenseItem };
