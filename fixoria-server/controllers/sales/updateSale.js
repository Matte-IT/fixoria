const pool = require("../../config/database");

async function updateSale(req, res) {
  const client = await pool.connect();

  try {
    const {
      party_id,
      sales_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      notes,
      sales_details,
    } = req.body;

    const { id } = req.params; // sales_id

    if (!id) {
      return res.status(400).json({ error: "Sales ID is required." });
    }

    if (
      !sales_details ||
      !Array.isArray(sales_details) ||
      sales_details.length === 0
    ) {
      return res.status(400).json({ error: "Sales details are required." });
    }

    // Begin transaction
    await client.query("BEGIN");

    // Update sales table
    const updateSalesQuery = `
      UPDATE sales.sales 
      SET 
        party_id = $1,
        sales_date = $2,
        total_amount = $3,
        tax_amount = $4,
        discount_amount = $5,
        grand_total = $6,
        notes = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE sales_id = $8
    `;
    await client.query(updateSalesQuery, [
      party_id,
      sales_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      notes,
      id,
    ]);

    // Delete existing sales_details for the sale
    const deleteSalesDetailsQuery = `
      DELETE FROM sales.sales_details 
      WHERE sales_id = $1
    `;
    await client.query(deleteSalesDetailsQuery, [id]);

    // Insert updated sales_details
    const insertSalesDetailsQuery = `
      INSERT INTO sales.sales_details (
        sales_id, item_id, quantity, price, tax_amount, discount_amount, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    for (const detail of sales_details) {
      const { item_id, quantity, price, tax_amount, discount_amount, total } =
        detail;

      await client.query(insertSalesDetailsQuery, [
        id,
        item_id,
        quantity,
        price,
        tax_amount,
        discount_amount,
        total,
      ]);
    }

    // Commit transaction
    await client.query("COMMIT");

    res.status(200).json({ message: "Sale updated successfully." });
  } catch (error) {
    console.error("Error updating sale:", error);

    // Rollback transaction on error
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Failed to update sale." });
  } finally {
    client.release();
  }
}

module.exports = { updateSale };
