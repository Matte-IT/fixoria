const pool = require("../../config/database");

const getAllParties = async (req, res) => {
  try {
    // Fetch all parties along with their opening_balance and balance_as_of_date where is_deleted = false
    const query = `
      SELECT 
        p.party_id,
        p.party_name,
        p.party_number,
        p.email,
        p.is_deleted,
        p.billing_address,
        pob.opening_balance,
        pob.balance_as_of_date
      FROM 
        party.party p
      LEFT JOIN 
        party.party_opening_balance pob
      ON 
        p.party_id = pob.party_id
      WHERE
        p.is_deleted = false
    `;

    const result = await pool.query(query);

    // Return parties with opening balance details, or an empty array if none are found
    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error("Error fetching parties:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllParties };
