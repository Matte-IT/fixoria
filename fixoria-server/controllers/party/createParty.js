const pool = require("../../config/database");

// Create A Party
const createParty = async (req, res) => {
  const {
    party_name,
    party_number,
    email,
    billing_address,
    opening_balance,
    balance_as_of_date,
  } = req.body;

  // Basic validation
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
    // Insert into the 'party' table and get the new party_id
    const newParty = await pool.query(
      `INSERT INTO party.party (party_name, party_number, email, billing_address)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [party_name, party_number, email || null, billing_address || null]
    );

    const partyId = newParty.rows[0].party_id;

    // Insert into 'party_opening_balance' table
    if (opening_balance && balance_as_of_date) {
      await pool.query(
        `INSERT INTO party.party_opening_balance (party_id, opening_balance, balance_as_of_date)
         VALUES ($1, $2, $3)`,
        [partyId, opening_balance, balance_as_of_date]
      );
    }

    res.status(201).json({
      message: "Party and opening balance created successfully",
      party: newParty.rows[0],
    });
  } catch (err) {
    console.error(err.message);

    // Check for unique constraint violation (example for PostgreSQL)
    if (err.code === "23505") {
      return res.status(409).json({ error: "Duplicate entry detected" });
    }

    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createParty };
