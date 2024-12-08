const pool = require("../../config/database");

async function getProductType(req, res) {
  try {
    const result = await pool.query("SELECT * FROM inventory.item_type");

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching item types:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getProductType };
