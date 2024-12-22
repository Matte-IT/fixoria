const pool = require("../../config/database");

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    // Update the `is_deleted` column to mark the product as deleted
    const result = await pool.query(
      `
      UPDATE inventory.item
      SET is_deleted = TRUE
      WHERE item_id = $1
      RETURNING item_id;
      `,
      [id]
    );

    // Check if the product was found and marked as deleted
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Successful response
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
}

module.exports = { deleteProduct };
