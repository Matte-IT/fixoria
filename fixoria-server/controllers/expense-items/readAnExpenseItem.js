const pool = require("../../config/database");

const readAnExpenseItem = async (req, res) => {
  const { id } = req.params; // Extracting the ID from request parameters

  // Validate the ID
  if (!id) {
    return res.status(400).json({
      error: "Expense item ID is required.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM inventory.expense_item 
       WHERE expense_item_id = $1`,
      [id]
    );

    // Check if the item exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Expense item not found.",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to retrieve expense item" });
  }
};

module.exports = { readAnExpenseItem };
