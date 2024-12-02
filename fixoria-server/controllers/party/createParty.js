const pool = require("../../config/database");

// Create A Party
const createParty = async (req, res) => {
  const { party_name, phone_number, email, billing_address } = req.body;

  // Basic validation
  if (!party_name) {
    return res.status(400).json({ error: "Party Name is required" });
  }

  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Insert the new party
    const newParty = await pool.query(
      "INSERT INTO parties (party_name, phone_number, email, billing_address) VALUES ($1, $2, $3, $4) RETURNING *",
      [party_name, phone_number || null, email || null, billing_address || null]
    );

    res.status(201).json(newParty.rows[0]);
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
