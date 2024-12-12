const pool = require("../../config/database");

async function createPurchase(req, res) {
  try {
    const {
      party_id,
      purchase_date,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      notes,
      purchase_details, // This is an array of items
    } = req.body;

    if (
      !party_id ||
      !purchase_date ||
      !purchase_details ||
      purchase_details.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields or items." });
    }

    // Start a transaction
    await pool.query("BEGIN");

    // Insert into purchases table
    const purchaseResult = await pool.query(
      `INSERT INTO purchase.purchases (
        party_id, purchase_date, total_amount, tax_amount, 
        discount_amount, grand_total, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING purchase_id`,
      [
        party_id,
        purchase_date,
        total_amount,
        tax_amount,
        discount_amount,
        grand_total,
        notes,
      ]
    );

    const purchase_id = purchaseResult.rows[0].purchase_id;

    // Insert multiple rows into purchase_details table
    const purchaseDetailsQuery = `
      INSERT INTO purchase.purchase_details (
        purchase_id, item_id, quantity, price, tax_amount, discount_amount, total
      ) VALUES 
      ${purchase_details
        .map(
          (_, index) =>
            `($1, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${
              index * 6 + 5
            }, $${index * 6 + 6}, $${index * 6 + 7})`
        )
        .join(", ")}
    `;

    const purchaseDetailsValues = purchase_details.flatMap((detail) => [
      detail.item_id,
      detail.quantity,
      detail.price,
      detail.tax_amount || 0,
      detail.discount_amount || 0,
      detail.total,
    ]);

    await pool.query(purchaseDetailsQuery, [
      purchase_id,
      ...purchaseDetailsValues,
    ]);

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(201).json({
      message: "Purchase created successfully",
    });
  } catch (error) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the purchase." });
  }
}

module.exports = { createPurchase };
