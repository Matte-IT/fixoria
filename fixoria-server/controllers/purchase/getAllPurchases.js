const pool = require("../../config/database");

const getAllPurchases = async (req, res) => {
  try {
    // Query to fetch purchases with party name
    const query = `
      SELECT 
        purchase.purchases.purchase_date,
        purchase.purchases.purchase_id,
        party.party.party_name,
        purchase.purchases.grand_total
      FROM 
        purchase.purchases
      INNER JOIN 
        party.party
      ON 
        purchase.purchases.party_id = party.party.party_id
      ORDER BY 
        purchase.purchases.purchase_id ASC; -- Sort by purchase_id in ascending order
    `;

    // Execute the query
    const result = await pool.query(query);

    // Send raw data directly
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching purchases:", error.message);

    // Handle error response
    res
      .status(500)
      .json({ error: "An error occurred while fetching purchases." });
  }
};

module.exports = { getAllPurchases };
