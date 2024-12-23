const pool = require("../../config/database");

async function createProduct(req, res) {
  // Extract fields from the request body
  const {
    item_name,
    category_id,
    type_id,
    unit_id,
    item_code,
    sale_price,
    purchase_price,
    wholesale_price,
    minimum_wholesale_quantity,
    opening_quantity,
    at_price,
    as_of_date,
    min_stock,
  } = req.body;

  // Handle the uploaded image (if any)
  const image_path = req.file ? req.file.path : null;

  try {
    // Insert into `inventory.item` table
    const itemResult = await pool.query(
      `
      INSERT INTO inventory.item (
        item_name, category_id, type_id, unit_id, image_path, item_code, sale_price, purchase_price, wholesale_price, minimum_wholesale_quantity
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING item_id;
      `,
      [
        item_name,
        category_id,
        type_id,
        unit_id,
        image_path,
        item_code,
        sale_price,
        purchase_price,
        wholesale_price,
        minimum_wholesale_quantity,
      ]
    );

    const itemId = itemResult.rows[0].item_id;

    // Handle stock-related operations for products (type_id = 1)
    if (parseInt(type_id) === 1) {
      // Validate stock-related fields
      if (
        opening_quantity == null ||
        at_price == null ||
        as_of_date == null ||
        min_stock == null
      ) {
        return res.status(400).json({
          message: "All stock fields are required for products.",
        });
      }

      // Insert into `inventory.stock` table
      await pool.query(
        `
        INSERT INTO inventory.stock (
          item_id, opening_quantity, at_price, as_of_date, min_stock
        )
        VALUES ($1, $2, $3, $4, $5);
        `,
        [itemId, opening_quantity, at_price, as_of_date, min_stock]
      );
    }

    // Successful response
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
}

module.exports = { createProduct };
