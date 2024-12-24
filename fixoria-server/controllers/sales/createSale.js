const pool = require("../../config/database");

async function createSales(req, res) {
  try {
    const {
      party_id,
      sales_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      notes,
      sales_details, // Array of items for sales_details
    } = req.body;

    // Validate required fields
    if (
      !party_id ||
      !sales_date ||
      !sales_details ||
      sales_details.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields or items." });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // Insert into the sales table
    const insertSalesQuery = `
      INSERT INTO sales.sales (
        party_id, sales_date, total_amount, tax_amount, discount_amount, grand_total, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING sales_id
    `;
    const salesResult = await pool.query(insertSalesQuery, [
      party_id,
      sales_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      notes,
    ]);

    const sales_id = salesResult.rows[0].sales_id;

    // Insert into the sales_details table for each item
    const insertSalesDetailsQuery = `
      INSERT INTO sales.sales_details (
        sales_id, item_id, quantity, price, tax_amount, discount_amount, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    for (const detail of sales_details) {
      const { item_id, quantity, price, tax_amount, discount_amount, total } =
        detail;

      await pool.query(insertSalesDetailsQuery, [
        sales_id,
        item_id,
        quantity,
        price,
        tax_amount,
        discount_amount,
        total,
      ]);
    }

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(201).json({
      message: "Sales created successfully",
      sales_id,
    });
  } catch (error) {
    // Rollback the transaction on error
    await pool.query("ROLLBACK");
    console.error("Error creating sales:", error);
    res.status(500).json({ error: "Failed to create sales" });
  }
}

module.exports = { createSales };
