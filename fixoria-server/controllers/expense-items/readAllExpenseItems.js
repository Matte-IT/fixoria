const pool = require("../../config/database");

const readAllExpenseItems = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM inventory.expense_item 
       WHERE is_active = TRUE 
       ORDER BY expense_item_id ASC`
    );
    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to retrieve expense items" });
  }
};

module.exports = { readAllExpenseItems };
