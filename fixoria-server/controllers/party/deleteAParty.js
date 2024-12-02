const pool = require("../../config/database");

const deleteAParty = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the party with the given id
    const result = await pool.query(
      "DELETE FROM parties WHERE party_id = $1 RETURNING *",
      [id]
    );

    // Check if the party was found and deleted
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Party not found" });
    }

    res.status(200).json({ message: "Party deleted successfully" });
  } catch (err) {
    console.error("Error deleting party:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { deleteAParty };
