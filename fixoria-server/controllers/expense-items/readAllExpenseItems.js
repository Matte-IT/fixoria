const pool = require("../../config/database");

const readAllExpenseItems = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        expense_item.expense_item_id,
        expense_item.name,
        expense_item.description,
        expense_item.unit_id,
        expense_item.price,
        expense_item.is_active,
        expense_item.created_at,
        expense_item.updated_at,
        units.unit_name
       FROM inventory.expense_item
       JOIN inventory.units ON expense_item.unit_id = units.unit_id
       WHERE expense_item.is_active = TRUE
       ORDER BY expense_item.expense_item_id ASC`
    );

    // if (result.rows.length === 0) {
    //   return res.status(404).json({ message: "No active expense items found" });
    // }

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve expense items" });
  }
};

module.exports = { readAllExpenseItems };
