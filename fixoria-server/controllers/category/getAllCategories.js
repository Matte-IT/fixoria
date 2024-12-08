const pool = require("../../config/database");

const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory.item_categories");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllCategories };
