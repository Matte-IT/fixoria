const pool = require("../../config/database");

const getSingleSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate sales_order_id
    if (!id) {
      return res.status(400).json({ error: "Sales order ID is required." });
    }

    // Query to fetch the sales order with its details, party name, and status
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
        sos.status_name,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'item_id', sod.item_id,
            'quantity', sod.quantity,
            'price', sod.price,
            'tax_amount', sod.tax_amount,
            'discount_amount', sod.discount_amount,
            'total', sod.total
          )
        ) AS sales_order_details
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
      LEFT JOIN 
        sales.sales_order_details sod
      ON 
        so.sales_order_id = sod.sales_order_id
      WHERE
        so.sales_order_id = $1
        AND so.is_deleted = false
      GROUP BY
        so.sales_order_id, p.party_name, sos.status_name;
    `;

    // Execute the query
    const result = await pool.query(query, [id]);

    // Check if sales order exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sales order not found." });
    }

    // Send the result
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Handle error response
    console.error("Error fetching sales order:", error);
    res.status(500).json({
      error: "An error occurred while fetching the sales order.",
    });
  }
};

module.exports = { getSingleSalesOrder };
