const pool = require("../../config/database");

const getAnExpense = async (req, res) => {
  const { id } = req.params; // Get expense_id from the route parameters
  const client = await pool.connect(); // Get a client from the connection pool

  try {
    // Query to fetch a single expense with item names
    const expenseQuery = `
      SELECT 
        e.expense_id,
        e.expense_date,
        e.total_amount,
        e.grand_total,
        e.notes,
        e.is_deleted,
        e.uploaded_file_path,
        e.created_at,
        e.updated_at,
        COALESCE(
          json_agg(
            jsonb_build_object(
              'expense_detail_id', ed.expense_detail_id,
              'expense_item_id', ed.expense_item_id,
              'item_name', ei.name,
              'quantity', ed.quantity,
              'price', ed.price,
              'total', ed.total,
              'created_at', ed.created_at,
              'updated_at', ed.updated_at
            )
          ) FILTER (WHERE ed.expense_detail_id IS NOT NULL), 
          '[]'
        ) AS expense_details
      FROM 
        purchase.expense e
      LEFT JOIN 
        purchase.expense_details ed ON e.expense_id = ed.expense_id
      LEFT JOIN 
        inventory.expense_item ei ON ed.expense_item_id = ei.expense_item_id
      WHERE 
        e.expense_id = $1
      GROUP BY 
        e.expense_id;
    `;

    const result = await client.query(expenseQuery, [id]); // Use `id` instead of `expense_id`

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Return the result
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching expense by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

module.exports = { getAnExpense };
