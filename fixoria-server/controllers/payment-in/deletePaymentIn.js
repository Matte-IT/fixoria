const pool = require("../../config/database");

const deletePaymentIn = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM sales.payment_in WHERE payment_in_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error in deletePaymentIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deletePaymentIn;
