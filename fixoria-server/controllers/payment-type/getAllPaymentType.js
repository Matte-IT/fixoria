const pool = require("../../config/database");

const getAllPaymentType = async (req, res) => {
  try {
    const query = `
      SELECT 
        payment_type_id,
        name,
        description,
        is_active,
        created_at,
        updated_at
      FROM 
        sales.payment_types
      ORDER BY
        payment_type_id ASC
    `;

    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllPaymentType };
