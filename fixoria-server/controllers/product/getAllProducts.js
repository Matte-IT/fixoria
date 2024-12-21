// const pool = require("../../config/database");

// async function getAllProducts(req, res) {
//   try {
//     const query = `
//       SELECT
//         p.*,
//         c.category_name,
//         u.unit_name
//       FROM inventory.item p
//       LEFT JOIN inventory.item_categories c ON p.category_id = c.category_id
//       LEFT JOIN inventory.units u ON p.unit_id = u.unit_id
//       WHERE p.is_deleted = false
//       ORDER BY p.created_at DESC
//     `;

//     const products = await pool.query(query);

//     return res.status(200).json(products.rows);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return res.status(500).json({
//       message: "Error fetching products",
//       error: error.message,
//     });
//   }
// }

// module.exports = { getAllProducts };

const pool = require("../../config/database");

async function getAllProducts(req, res) {
  try {
    const query = `
      SELECT 
        p.*,
        c.category_name,
        u.unit_name
      FROM inventory.item p
      LEFT JOIN inventory.item_categories c ON p.category_id = c.category_id
      LEFT JOIN inventory.units u ON p.unit_id = u.unit_id
      WHERE p.is_deleted = false
      ORDER BY p.created_at DESC
    `;

    const products = await pool.query(query);

    // Normalize the image_path for each product
    const sanitizedProducts = products.rows.map((product) => ({
      ...product,
      image_path: product.image_path
        ? product.image_path.replace(/\\/g, "/")
        : null, // Replace backslashes with forward slashes
    }));

    return res.status(200).json(sanitizedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
}

module.exports = { getAllProducts };
