const pool = require("../../config/database");

const getAllUnits = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory.units");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllUnits };
