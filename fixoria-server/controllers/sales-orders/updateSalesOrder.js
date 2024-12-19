const pool = require("../../config/database");

async function updateSalesOrder(req, res) {
  try {
    const { id } = req.params; // Extract id from req.params
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
      sales_order_details, // Array of items
    } = req.body;

    // Validate required fields
    if (
      !id ||
      !party_id ||
      !sales_order_date ||
      !sales_order_details ||
      sales_order_details.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields or sales order details." });
    }

    // Start a transaction
    await pool.query("BEGIN");

    // Update sales_orders table
    const updateSalesOrderQuery = `
      UPDATE sales.sales_orders
      SET 
        party_id = $1,
        sales_order_date = $2,
        expected_delivery_date = $3,
        total_amount = $4,
        tax_amount = $5,
        discount_amount = $6,
        grand_total = $7,
        status_id = $8,
        notes = $9
      WHERE 
        sales_order_id = $10
    `;

    await pool.query(updateSalesOrderQuery, [
      party_id,
      sales_order_date,
      expected_delivery_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      status_id,
      notes,
      id, // Use id from req.params
    ]);

    // Delete existing sales_order_details for the given sales_order_id
    await pool.query(
      "DELETE FROM sales.sales_order_details WHERE sales_order_id = $1",
      [id]
    );

    // Insert updated sales_order_details
    const insertSalesOrderDetailsQuery = `
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

    await pool.query(insertSalesOrderDetailsQuery, [
      id,
      ...salesOrderDetailsValues,
    ]);

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({ message: "Sales order updated successfully." });
  } catch (error) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");
    console.error("Error updating sales order:", error);
    res.status(500).json({
      error: "An error occurred while updating the sales order.",
    });
  }
}

module.exports = { updateSalesOrder };
