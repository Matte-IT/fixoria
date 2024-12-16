const pool = require("../../config/database");

const getSinglePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Purchase ID is required." });
    }

    // Query to fetch purchase, party, and item details
    const query = `
      SELECT 
        purchase.purchases.purchase_id,
        purchase.purchases.purchase_order_id,
        purchase.purchases.purchase_date,
        purchase.purchases.total_amount,
        purchase.purchases.tax_amount,
        purchase.purchases.discount_amount,
        purchase.purchases.grand_total,
        purchase.purchases.notes,
        purchase.purchases.is_deleted,
        purchase.purchases.created_at AS purchase_created_at,
        purchase.purchases.updated_at AS purchase_updated_at,
        party.party.party_id,
        party.party.party_name,
        purchase.purchase_details.purchase_detail_id,
        purchase.purchase_details.item_id,
        purchase.purchase_details.quantity,
        purchase.purchase_details.price,
        purchase.purchase_details.tax_amount AS tax_amount,
        purchase.purchase_details.discount_amount AS discount_amount,
        purchase.purchase_details.total AS total,
        purchase.purchase_details.created_at AS detail_created_at,
        purchase.purchase_details.updated_at AS detail_updated_at,
        inventory.item.item_name
      FROM 
        purchase.purchases
      INNER JOIN 
        party.party
      ON 
        purchase.purchases.party_id = party.party.party_id
      INNER JOIN 
        purchase.purchase_details
      ON 
        purchase.purchases.purchase_id = purchase.purchase_details.purchase_id
      INNER JOIN 
        inventory.item
      ON 
        purchase.purchase_details.item_id = inventory.item.item_id
      WHERE 
        purchase.purchases.purchase_id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase not found." });
    }

    // Transform the result into the desired format
    const purchaseData = {
      purchase_id: result.rows[0].purchase_id,
      purchase_order_id: result.rows[0].purchase_order_id,
      purchase_date: result.rows[0].purchase_date,
      total_amount: result.rows[0].total_amount,
      tax_amount: result.rows[0].tax_amount,
      discount_amount: result.rows[0].discount_amount,
      grand_total: result.rows[0].grand_total,
      notes: result.rows[0].notes,
      is_deleted: result.rows[0].is_deleted,
      created_at: result.rows[0].purchase_created_at,
      updated_at: result.rows[0].purchase_updated_at,
      party_id: result.rows[0].party_id,
      party_name: result.rows[0].party_name,
      purchase_details: result.rows.map((row) => ({
        purchase_detail_id: row.purchase_detail_id,
        item_id: row.item_id,
        item_name: row.item_name,
        quantity: row.quantity,
        price: row.price,
        tax_amount: row.tax_amount,
        discount_amount: row.discount_amount,
        total: row.total,
        created_at: row.detail_created_at,
        updated_at: row.detail_updated_at,
      })),
    };

    res.status(200).json(purchaseData);
  } catch (error) {
    console.error("Error fetching purchase:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the purchase." });
  }
};

module.exports = { getSinglePurchase };
