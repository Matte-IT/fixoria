const pool = require("../../config/database");

const createPaymentIn = async (req, res) => {
  try {
    const paymentData = {
      ...req.body,
      uploaded_file_path: req.file ? req.file.filename : null,
      party_id: Number(req.body.party_id),
      payment_type_id: Number(req.body.payment_type_id),
      received_amount: Number(req.body.received_amount),
    };

    // Check required fields
    if (!paymentData.party_id) {
      return res.status(400).json({ error: "Party is required" });
    }

    if (!paymentData.payment_type_id) {
      return res.status(400).json({ error: "Payment type is required" });
    }

    if (!paymentData.received_amount) {
      return res.status(400).json({ error: "Received amount is required" });
    }

    // Check if notes is required for payment_type_id 2
    if (paymentData.payment_type_id === 2 && !paymentData.notes) {
      return res
        .status(400)
        .json({ error: "Notes is required for this payment type" });
    }

    const result = await pool.query(
      `INSERT INTO sales.payment_in 
      (payment_date, party_id, payment_type_id, notes, uploaded_file_path, received_amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        paymentData.payment_date,
        paymentData.party_id,
        paymentData.payment_type_id,
        paymentData.notes || null,
        paymentData.uploaded_file_path,
        paymentData.received_amount,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error in createPaymentIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = createPaymentIn;
