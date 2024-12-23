const pool = require("../../config/database");

const updateAParty = async (req, res) => {
  const party_id = req.params.id;
  const {
    party_name,
    party_number,
    email,
    billing_address,
    opening_balance,
    balance_as_of_date,
  } = req.body;

  // Basic validation
  if (!party_id) {
    return res.status(400).json({ error: "Party ID is required" });
  }
  if (!party_name) {
    return res.status(400).json({ error: "Party Name is required" });
  }
  if (!party_number) {
    return res.status(400).json({ error: "Party Number is required" });
  }
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Begin a transaction
    await pool.query("BEGIN");

    // Update the 'party' table
    await pool.query(
      `UPDATE party.party
       SET party_name = $1, party_number = $2, email = $3, billing_address = $4
       WHERE party_id = $5`,
      [
        party_name,
        party_number,
        email || null,
        billing_address || null,
        party_id,
      ]
    );

    // Update the 'party_opening_balance' table
    const existingBalance = await pool.query(
      `SELECT * FROM party.party_opening_balance WHERE party_id = $1`,
      [party_id]
    );

    if (existingBalance.rows.length > 0) {
      // Update existing record with provided values
      await pool.query(
        `UPDATE party.party_opening_balance
         SET opening_balance = $1, balance_as_of_date = $2
         WHERE party_id = $3`,
        [opening_balance, balance_as_of_date, party_id]
      );
    } else {
      // Insert new record if none exists
      await pool.query(
        `INSERT INTO party.party_opening_balance (party_id, opening_balance, balance_as_of_date)
         VALUES ($1, $2, $3)`,
        [party_id, opening_balance, balance_as_of_date]
      );
    }

    // Commit transaction
    await pool.query("COMMIT");

    res.status(200).json({ message: "Party updated successfully" });
  } catch (err) {
    // Rollback transaction in case of error
    await pool.query("ROLLBACK");

    console.error(err.message);

    // Handle unique constraint violations
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Duplicate entry detected. Check party_number or email.",
      });
    }

    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { updateAParty };
