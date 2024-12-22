const pool = require("../../config/database");

const getAllExpenses = async (req, res) => {
  const client = await pool.connect(); // Get a client from the connection pool

  try {
    // Query to fetch all expenses with item names
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
      WHERE e.is_deleted = false 
      GROUP BY 
        e.expense_id
      ORDER BY 
        e.expense_date DESC;
    `;

    const result = await client.query(expenseQuery);

    // Return the result
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching expenses with item names:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

module.exports = { getAllExpenses };
