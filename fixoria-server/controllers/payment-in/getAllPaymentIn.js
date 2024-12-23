const pool = require("../../config/database");

const getAllPaymentIn = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        sales.payment_in.*,
        party.party.party_name,
        sales.payment_types.name as payment_type_name
      FROM sales.payment_in
      JOIN party.party ON sales.payment_in.party_id = party.party.party_id
      JOIN sales.payment_types ON sales.payment_in.payment_type_id = sales.payment_types.payment_type_id
      ORDER BY sales.payment_in.payment_in_id ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error in getAllPaymentIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAllPaymentIn;
