const pool = require("../../config/database");

// Create A Category
const createCategory = async (req, res) => {
  const { category_name, parent_category_id } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    // Check if the category_name already exists
    const existingCategory = await pool.query(
      `SELECT * FROM inventory.item_categories WHERE category_name = $1`,
      [category_name]
    );

    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    // Insert the new category
    const newCategory = await pool.query(
      "INSERT INTO inventory.item_categories (category_name, parent_category_id) VALUES ($1, $2) RETURNING *",
      [category_name, parent_category_id || null]
    );

    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createCategory };
