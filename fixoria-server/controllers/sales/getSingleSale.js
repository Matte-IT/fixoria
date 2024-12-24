const pool = require("../../config/database");

async function getSingleSale(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Sales ID is required." });
  }

  const client = await pool.connect();

  try {
    // Query to get editable fields from the sales table
    const saleQuery = `
      SELECT 
        s.sales_id,
        s.party_id,
        s.total_amount,
        s.grand_total,
        p.party_name,
        s.sales_date,
        s.notes,
        s.tax_amount,
        s.discount_amount
      FROM sales.sales s
      LEFT JOIN party.party p ON s.party_id = p.party_id
      WHERE s.sales_id = $1 AND s.is_deleted = FALSE
    `;
    const saleResult = await client.query(saleQuery, [id]);

    if (saleResult.rows.length === 0) {
      return res.status(404).json({ error: "Sale not found." });
    }

    const sale = saleResult.rows[0];

    // Query to get editable fields from sales_details table, including unit name
    const salesDetailsQuery = `
      SELECT 
        sd.sales_detail_id,
        sd.item_id,
        i.item_name,
        u.unit_name,
        sd.quantity,
        sd.price,
        sd.total
      FROM sales.sales_details sd
      LEFT JOIN inventory.item i ON sd.item_id = i.item_id
      LEFT JOIN inventory.units u ON i.unit_id = u.unit_id
      WHERE sd.sales_id = $1
    `;
    const salesDetailsResult = await client.query(salesDetailsQuery, [id]);

    // Add the sales details to the main sale object
    sale.sales_details = salesDetailsResult.rows;

    // Send the response
    res.status(200).json(sale);
  } catch (error) {
    console.error("Error fetching sale data:", error);
    res.status(500).json({ error: "Failed to fetch sale data." });
  } finally {
    client.release();
  }
}

module.exports = { getSingleSale };
