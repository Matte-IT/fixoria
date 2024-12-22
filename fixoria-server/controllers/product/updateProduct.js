const pool = require("../../config/database");

async function updateProduct(req, res) {
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

  const { id } = req.params; // Assuming `id` is passed in the request URL as the product identifier

  const image_path = req.file ? req.file.path : null; // Handle uploaded image (if any)

  try {
    // Update the product in the `inventory.item` table
    const updateItemResult = await pool.query(
      `
      UPDATE inventory.item
      SET
        item_name = $1,
        category_id = $2,
        type_id = $3,
        unit_id = $4,
        item_code = $5,
        sale_price = $6,
        purchase_price = $7,
        wholesale_price = $8,
        minimum_wholesale_quantity = $9,
        image_path = COALESCE($10, image_path)
      WHERE item_id = $11
      RETURNING item_id;
      `,
      [
        item_name,
        category_id,
        type_id,
        unit_id,
        item_code,
        sale_price,
        purchase_price,
        wholesale_price,
        minimum_wholesale_quantity,
        image_path,
        id, // Replacing `id` in query with `item_id`
      ]
    );

    // Ensure the product exists
    if (updateItemResult.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle stock-related updates for products (type_id = 1)
    if (parseInt(type_id) === 1) {
      if (
        opening_quantity != null &&
        at_price != null &&
        as_of_date != null &&
        min_stock != null
      ) {
        // Update the stock in the `inventory.stock` table
        await pool.query(
          `
          INSERT INTO inventory.stock (item_id, opening_quantity, at_price, as_of_date, min_stock)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (item_id) DO UPDATE 
          SET
            opening_quantity = EXCLUDED.opening_quantity,
            at_price = EXCLUDED.at_price,
            as_of_date = EXCLUDED.as_of_date,
            min_stock = EXCLUDED.min_stock;
          `,
          [id, opening_quantity, at_price, as_of_date, min_stock]
        );
      }
    }

    // Successful response
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
}

module.exports = { updateProduct };
