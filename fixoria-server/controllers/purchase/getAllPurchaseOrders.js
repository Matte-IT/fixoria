const pool = require("../../config/database");

const getAllPurchaseOrders = async (req, res) => {
  try {
    // Query to fetch purchase orders with party name and status
    const query = `
      SELECT 
        po.purchase_order_id,
        po.purchase_order_date,
        po.expected_delivery_date,
        p.party_name,
        po.total_amount,
        po.tax_amount,
        po.discount_amount,
        po.grand_total,
        po.notes,
        pos.status_name
      FROM 
        purchase.purchase_orders po
      INNER JOIN 
        party.party p
      ON 
        po.party_id = p.party_id
      INNER JOIN
        purchase.purchase_order_status pos
      ON
        po.status_id = pos.status_id
      WHERE
        po.is_deleted = false
      ORDER BY 
        po.purchase_order_id ASC;
    `;

    // Execute the query
    const result = await pool.query(query);

    // Send raw data directly
    res.status(200).json(result.rows);
  } catch (error) {
    // Handle error response
    res
      .status(500)
      .json({ error: "An error occurred while fetching purchase orders." });
  }
};

module.exports = { getAllPurchaseOrders };