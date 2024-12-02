const pool = require("../../config/database");

const getAllParties = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM parties");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllParties };
