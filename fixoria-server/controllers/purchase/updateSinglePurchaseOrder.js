const pool = require("../../config/database");

const updateSinglePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      party_id,
      purchase_order_date,
      expected_delivery_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      status_id,
      notes,
      purchase_order_details,
    } = req.body;

    await pool.query("BEGIN");

    // Update purchase order
    const updateOrderQuery = `
      UPDATE purchase.purchase_orders 
      SET 
        party_id = $1,
        purchase_order_date = $2,
        expected_delivery_date = $3,
        total_amount = $4,
        tax_amount = $5,
        discount_amount = $6,
        grand_total = $7,
        status_id = $8,
        notes = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE purchase_order_id = $10
    `;

    await pool.query(updateOrderQuery, [
      party_id,
      purchase_order_date,
      expected_delivery_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      status_id,
      notes,
      id,
    ]);

    // Delete existing details
    await pool.query(
      "DELETE FROM purchase.purchase_order_details WHERE purchase_order_id = $1",
      [id]
    );

    // Insert new details
    const detailsQuery = `
      INSERT INTO purchase.purchase_order_details 
      (purchase_order_id, item_id, quantity, price, tax_amount, discount_amount, total) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (const detail of purchase_order_details) {
      await pool.query(detailsQuery, [
        id,
        detail.item_id,
        detail.quantity,
        detail.price,
        detail.tax_amount,
        detail.discount_amount,
        detail.total,
      ]);
    }

    await pool.query("COMMIT");

    res.status(200).json({
      message: "Purchase order updated successfully",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error updating purchase order:", error);
    res.status(500).json({
      error: "An error occurred while updating the purchase order",
    });
  }
};

module.exports = { updateSinglePurchaseOrder };
