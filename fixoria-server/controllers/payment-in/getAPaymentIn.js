const pool = require("../../config/database");

const getAPaymentIn = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        sales.payment_in.*,
        party.party.party_name,
        sales.payment_types.name as payment_type_name
      FROM sales.payment_in
      JOIN party.party ON sales.payment_in.party_id = party.party.party_id
      JOIN sales.payment_types ON sales.payment_in.payment_type_id = sales.payment_types.payment_type_id
      WHERE sales.payment_in.payment_in_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error in getAPaymentIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAPaymentIn;
