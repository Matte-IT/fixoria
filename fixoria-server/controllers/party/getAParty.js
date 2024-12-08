const pool = require("../../config/database");

const getAParty = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM party.party WHERE party_id = $1",
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
