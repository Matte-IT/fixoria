const pool = require("../../config/database");

const getAllUnits = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM units");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllUnits };
