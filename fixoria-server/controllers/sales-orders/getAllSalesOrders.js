const pool = require("../../config/database");

async function getAllSalesOrders(req, res) {
  try {
    // Query to fetch sales orders with party name and status
    const query = `
      SELECT 
        so.sales_order_id,
        so.sales_order_date,
        so.expected_delivery_date,
        p.party_name,
        so.total_amount,
        so.tax_amount,
        so.discount_amount,
        so.grand_total,
        so.notes,
        sos.status_name
      FROM 
        sales.sales_orders so
      INNER JOIN 
        party.party p
      ON 
        so.party_id = p.party_id
      INNER JOIN
        sales.sales_order_status sos
      ON
        so.status_id = sos.status_id
      WHERE
        so.is_deleted = false
      ORDER BY 
        so.sales_order_id ASC;
    `;

    // Execute the query
    const result = await pool.query(query);

    // Send raw data directly
    res.status(200).json(result.rows);
  } catch (error) {
    // Handle error response
    console.error("Error fetching sales orders:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching sales orders." });
  }
}

module.exports = { getAllSalesOrders };
