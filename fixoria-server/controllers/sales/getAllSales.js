const pool = require("../../config/database");

async function getAllSales(req, res) {
  try {
    const query = `
            SELECT 
                s.sales_id,
                s.sales_date,
                p.party_name,
                s.grand_total
            FROM 
                sales.sales s
            INNER JOIN 
                party.party p ON s.party_id = p.party_id
            WHERE 
                s.is_deleted = FALSE
            ORDER BY 
                s.sales_id;
        `;

    const result = await pool.query(query);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error in getAllSales:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

module.exports = { getAllSales };
