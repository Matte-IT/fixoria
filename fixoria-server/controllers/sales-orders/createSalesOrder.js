const pool = require("../../config/database");

async function createSalesOrder(req, res) {
  try {
    const {
      party_id,
      sales_order_date,
      expected_delivery_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      status_id,
      notes,
      sales_order_details, // This is an array of items
    } = req.body;

    // Validate required fields
    if (
      !party_id ||
      !sales_order_date ||
      !sales_order_details ||
      sales_order_details.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields or items." });
    }

    // Validate status_id exists in sales_order_status table
    const statusResult = await pool.query(
      "SELECT status_id FROM sales.sales_order_status WHERE status_id = $1",
      [status_id]
    );

    if (statusResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid status_id" });
    }

    // Start a transaction
    await pool.query("BEGIN");

    // Insert into sales_orders table
    const salesOrderResult = await pool.query(
      `INSERT INTO sales.sales_orders (
        party_id, 
        sales_order_date,
        expected_delivery_date,
        total_amount, 
        tax_amount, 
        discount_amount, 
        grand_total,
        status_id,
        notes,
        is_deleted
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING sales_order_id`,
      [
        party_id,
        sales_order_date,
        expected_delivery_date,
        total_amount,
        tax_amount,
        discount_amount,
        grand_total,
        status_id,
        notes,
        false, // is_deleted default value
      ]
    );

    const sales_order_id = salesOrderResult.rows[0].sales_order_id;

    // Insert multiple rows into sales_order_details table
    const salesOrderDetailsQuery = `
      INSERT INTO sales.sales_order_details (
        sales_order_id, 
        item_id, 
        quantity, 
        price, 
        tax_amount, 
        discount_amount, 
        total
      ) VALUES 
      ${sales_order_details
        .map(
          (_, index) =>
            `($1, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${
              index * 6 + 5
            }, $${index * 6 + 6}, $${index * 6 + 7})`
        )
        .join(", ")};
    `;

    const salesOrderDetailsValues = sales_order_details.flatMap((detail) => [
      detail.item_id,
      detail.quantity,
      detail.price,
      detail.tax_amount || 0,
      detail.discount_amount || 0,
      detail.total,
    ]);

    await pool.query(salesOrderDetailsQuery, [
      sales_order_id,
      ...salesOrderDetailsValues,
    ]);

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(201).json({
      message: "Sales Order created successfully",
      sales_order_id,
    });
  } catch (error) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");
    console.error("Error details:", error);
    res.status(500).json({
      error: "An error occurred while creating the sales order.",
    });
  }
}

module.exports = { createSalesOrder };