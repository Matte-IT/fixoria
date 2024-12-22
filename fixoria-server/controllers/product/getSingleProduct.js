const pool = require("../../config/database");

async function getSingleProduct(req, res) {
  try {
    const { id } = req.params; // Get the item_id from the request parameters

    const query = `
      SELECT 
        p.*,
        c.category_name,
        u.unit_name,
        s.opening_quantity,
        s.at_price,
        s.as_of_date,
        s.min_stock
      FROM inventory.item p
      LEFT JOIN inventory.item_categories c ON p.category_id = c.category_id
      LEFT JOIN inventory.units u ON p.unit_id = u.unit_id
      LEFT JOIN inventory.stock s ON p.item_id = s.item_id
      WHERE p.item_id = $1 AND p.is_deleted = false
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Normalize the image_path for the product
    const product = {
      ...result.rows[0],
      image_path: result.rows[0].image_path
        ? result.rows[0].image_path.replace(/\\/g, "/")
        : null, // Replace backslashes with forward slashes
    };

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
}

module.exports = { getSingleProduct };
