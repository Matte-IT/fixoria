const pool = require("../../config/database");

const deleteAParty = async (req, res) => {
  const { id } = req.params;

  try {
    // Update is_deleted to true for the specified party
    const result = await pool.query(
      `
      UPDATE party.party
      SET is_deleted = true
      WHERE party_id = $1
      RETURNING party_name
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Party not found" });
    }

    res.status(200).json({
      message: `${result.rows[0].party_name} Deleted successfully`,
    });
  } catch (err) {
    console.error("Error marking party as deleted:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteAParty };
