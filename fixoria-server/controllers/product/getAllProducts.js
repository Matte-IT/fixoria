const pool = require("../../config/database");

async function getAllProducts(req, res) {
  try {
    const result = await pool.query("SELECT * FROM inventory.item");

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getAllProducts };
