const pool = require("../../config/database");
const fs = require('fs');
const path = require('path');

const deletePaymentIn = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the file path before deleting the record
    const filePathQuery = await pool.query(
      "SELECT uploaded_file_path FROM sales.payment_in WHERE payment_in_id = $1",
      [id]
    );

    const filePath = filePathQuery.rows[0]?.uploaded_file_path;

    // Delete the record
    const result = await pool.query(
      "DELETE FROM sales.payment_in WHERE payment_in_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // If file exists, delete it
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error in deletePaymentIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deletePaymentIn;
