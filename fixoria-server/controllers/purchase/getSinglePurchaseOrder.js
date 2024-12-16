const pool = require("../../config/database");

const getSinglePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Purchase Order ID is required." });
    }

    // Query to fetch purchase order, party, status and item details
    const query = `
      SELECT 
        po.purchase_order_id,
        po.purchase_order_date,
        po.expected_delivery_date,
        po.total_amount,
        po.tax_amount,
        po.discount_amount,
        po.grand_total,
        po.notes,
        po.is_deleted,
        po.created_at AS purchase_order_created_at,
        po.updated_at AS purchase_order_updated_at,
        p.party_id,
        p.party_name,
        pos.status_id,
        pos.status_name,
        pod.purchase_order_detail_id,
        pod.item_id,
        pod.quantity,
        pod.price,
        pod.tax_amount AS detail_tax_amount,
        pod.discount_amount AS detail_discount_amount,
        pod.total AS detail_total,
        pod.created_at AS detail_created_at,
        pod.updated_at AS detail_updated_at,
        i.item_name
      FROM 
        purchase.purchase_orders po
      INNER JOIN 
        party.party p
      ON 
        po.party_id = p.party_id
      INNER JOIN
        purchase.purchase_order_status pos
      ON
        po.status_id = pos.status_id
      INNER JOIN 
        purchase.purchase_order_details pod
      ON 
        po.purchase_order_id = pod.purchase_order_id
      INNER JOIN 
        inventory.item i
      ON 
        pod.item_id = i.item_id
      WHERE 
        po.purchase_order_id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase order not found." });
    }

    // Transform the result into the desired format
    const purchaseOrderData = {
      purchase_order_id: result.rows[0].purchase_order_id,
      purchase_order_date: result.rows[0].purchase_order_date,
      expected_delivery_date: result.rows[0].expected_delivery_date,
      total_amount: result.rows[0].total_amount,
      tax_amount: result.rows[0].tax_amount,
      discount_amount: result.rows[0].discount_amount,
      grand_total: result.rows[0].grand_total,
      notes: result.rows[0].notes,
      is_deleted: result.rows[0].is_deleted,
      created_at: result.rows[0].purchase_order_created_at,
      updated_at: result.rows[0].purchase_order_updated_at,
      party_id: result.rows[0].party_id,
      party_name: result.rows[0].party_name,
      status_id: result.rows[0].status_id,
      status_name: result.rows[0].status_name,
      purchase_order_details: result.rows.map((row) => ({
        purchase_order_detail_id: row.purchase_order_detail_id,
        item_id: row.item_id,
        item_name: row.item_name,
        quantity: row.quantity,
        price: row.price,
        tax_amount: row.detail_tax_amount,
        discount_amount: row.detail_discount_amount,
        total: row.detail_total,
        created_at: row.detail_created_at,
        updated_at: row.detail_updated_at,
      })),
    };

    res.status(200).json(purchaseOrderData);
  } catch (error) {
    console.error("Error fetching purchase order:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the purchase order." });
  }
};

module.exports = { getSinglePurchaseOrder };
