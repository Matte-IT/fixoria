const pool = require("../../config/database");
const fs = require('fs');
const path = require('path');

const updatePaymentIn = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get existing file path
    const existingFileQuery = await pool.query(
      `SELECT uploaded_file_path FROM sales.payment_in WHERE payment_in_id = $1`,
      [id]
    );
    const existingFilePath = existingFileQuery.rows[0]?.uploaded_file_path;

    const paymentData = {
      ...req.body,
      uploaded_file_path: req.file
        ? req.file.path.replace(/\\/g, "/")
        : req.body.uploaded_file_path,
      party_id: Number(req.body.party_id),
      payment_type_id: Number(req.body.payment_type_id),
      received_amount: Number(req.body.received_amount),
      payment_date: req.body.payment_date
    };

    // Required fields validation
    if (
      !paymentData.party_id ||
      !paymentData.payment_type_id ||
      !paymentData.received_amount ||
      !paymentData.payment_date
    ) {
      // Delete newly uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Notes validation for payment_type_id 2
    if (paymentData.payment_type_id === 2 && !paymentData.notes) {
      // Delete newly uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ error: "Notes required for this payment type" });
    }

    const result = await pool.query(
      `UPDATE sales.payment_in 
       SET payment_date = $1::date,
           party_id = $2,
           payment_type_id = $3,
           notes = $4,
           uploaded_file_path = $5,
           received_amount = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE payment_in_id = $7
       RETURNING *`,
      [
        paymentData.payment_date,
        paymentData.party_id,
        paymentData.payment_type_id,
        paymentData.notes,
        paymentData.uploaded_file_path,
        paymentData.received_amount,
        id,
      ]
    );

    if (result.rows.length === 0) {
      // Delete newly uploaded file if payment not found
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: "Payment not found" });
    }

    // Delete old file if new file is uploaded successfully
    if (req.file && existingFilePath && fs.existsSync(existingFilePath)) {
      fs.unlinkSync(existingFilePath);
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Delete newly uploaded file if any error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error in updatePaymentIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updatePaymentIn;
