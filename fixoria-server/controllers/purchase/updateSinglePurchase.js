const pool = require("../../config/database");

const updateSinglePurchase = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      party_id,
      purchase_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      notes,
      purchase_details,
    } = req.body;

    await client.query("BEGIN");

    // Update main purchase record
    const updatePurchaseQuery = `
      UPDATE purchase.purchases 
      SET 
        party_id = $1,
        purchase_date = $2,
        total_amount = $3,
        tax_amount = $4,
        discount_amount = $5,
        grand_total = $6,
        notes = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE purchase_id = $8
      RETURNING *;
    `;

    const purchaseResult = await client.query(updatePurchaseQuery, [
      party_id,
      purchase_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      notes,
      id,
    ]);

    // Delete existing purchase details
    await client.query(
      "DELETE FROM purchase.purchase_details WHERE purchase_id = $1",
      [id]
    );

    // Insert new purchase details
    const detailsQuery = `
      INSERT INTO purchase.purchase_details 
      (purchase_id, item_id, quantity, price, tax_amount, discount_amount, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const detailsPromises = purchase_details.map((detail) =>
      client.query(detailsQuery, [
        id,
        detail.item_id,
        detail.quantity,
        detail.price,
        detail.tax_amount,
        detail.discount_amount,
        detail.total,
      ])
    );

    await Promise.all(detailsPromises);

    await client.query("COMMIT");

    res.status(200).json({
      message: "Purchase updated successfully",
      purchase: purchaseResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating purchase:", error);
    res.status(500).json({
      error: "An error occurred while updating the purchase",
      details: error.message,
    });
  } finally {
    client.release();
  }
};

module.exports = { updateSinglePurchase };
