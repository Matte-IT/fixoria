const pool = require("../../config/database");

const updateAnExpenseItem = async (req, res) => {
  const { id } = req.params; // Extracting the ID from request parameters
  const { name, description, unit_id, price } = req.body; // Extracting fields from request body

  // Validate the ID
  if (!id) {
    return res.status(400).json({
      error: "Expense item ID is required.",
    });
  }

  // Initialize fields to be updated
  const fields = [];
  const values = [];
  let counter = 1;

  // Validate and collect the fields to be updated
  if (name) {
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        error: "Name must be a non-empty string.",
      });
    }
    fields.push(`name = $${counter++}`);
    values.push(name);
  }

  if (description) {
    if (typeof description !== "string") {
      return res.status(400).json({
        error: "Description must be a string.",
      });
    }
    fields.push(`description = $${counter++}`);
    values.push(description);
  }

  if (unit_id) {
    if (!Number.isInteger(unit_id) || unit_id <= 0) {
      return res.status(400).json({
        error: "Unit ID must be a positive integer.",
      });
    }
    fields.push(`unit_id = $${counter++}`);
    values.push(unit_id);
  }

  if (price) {
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        error: "Price must be a positive number.",
      });
    }
    fields.push(`price = $${counter++}`);
    values.push(price);
  }

  // If no valid fields to update
  if (fields.length === 0) {
    return res.status(400).json({
      error:
        "At least one field (name, description, unit_id, price) must be provided for update.",
    });
  }

  // Add ID to the values array for the WHERE clause
  values.push(id);

  // Construct the dynamic query
  const query = `
    UPDATE inventory.expense_item
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE expense_item_id = $${counter}
    RETURNING *`;

  try {
    const result = await pool.query(query, values);

    // Check if the item was updated
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Expense item not found.",
      });
    }

    res.status(200).json({ message: "Expense Item updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update expense item" });
  }
};

module.exports = { updateAnExpenseItem };
