const pool = require("../../config/database");

const getAParty = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch party details along with opening balance and balance_as_of_date
    const result = await pool.query(
      `
      SELECT 
        p.party_id,
        p.party_name,
        p.party_number,
        p.is_deleted,
        p.email,
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
        p.party_id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Party not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching party:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAParty };
