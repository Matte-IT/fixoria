const pool = require("../../config/database");

const updateAParty = async (req, res) => {
  const { id } = req.params;
  const { party_name, phone_number, email, billing_address } = req.body;

  try {
    // console.log("Update request received:", { id, ...req.body });

    const result = await pool.query(
      "UPDATE parties SET party_name = $1, phone_number = $2, email = $3, billing_address = $4 WHERE party_id = $5 RETURNING *",
      [party_name, phone_number, email, billing_address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Party not found");
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating party:", err);
    res.status(500).json({ error: err.message }); // Send detailed error
  }
};

module.exports = { updateAParty };
