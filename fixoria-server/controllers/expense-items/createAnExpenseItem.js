// const pool = require("../../config/database");

// const createAnExpenseItem = async (req, res) => {
//   const { name, description, unit_id, price } = req.body;

//   // Validate required fields
//   if (!name) {
//     return res.status(400).json({
//       error: "Name is a required field.",
//     });
//   }

//   if (!unit_id) {
//     return res.status(400).json({
//       error: "Unit ID is a required field.",
//     });
//   }

//   if (!price) {
//     return res.status(400).json({
//       error: "Price is a required field.",
//     });
//   }

//   try {
//     const result = await pool.query(
//       `INSERT INTO inventory.expense_item (name, description, unit_id, price, is_active)
//          VALUES ($1, $2, $3, $4, TRUE)
//          RETURNING *`,
//       [name, description, unit_id, price]
//     );

//     res.status(201).json({
//       message: "Expense item created successfully!",
//       data: result.rows[0],
//     });
//   } catch (err) {
//     console.error(err.message);

//     if (err.code === "23505") {
//       return res
//         .status(409)
//         .json({ error: "Expense item with the same name already exists." });
//     }

//     res.status(500).json({ error: "Failed to create expense item" });
//   }
// };

// module.exports = { createAnExpenseItem };

const pool = require("../../config/database");

const createAnExpenseItem = async (req, res) => {
  const { name, description, unit_id, price } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({
      error: "Name is a required field.",
    });
  }

  if (!unit_id) {
    return res.status(400).json({
      error: "Unit ID is a required field.",
    });
  }

  if (!price) {
    return res.status(400).json({
      error: "Price is a required field.",
    });
  }

  try {
    // Check if an expense item with the same name already exists
    const existingItem = await pool.query(
      `SELECT * FROM inventory.expense_item WHERE name = $1 AND is_active = TRUE`,
      [name]
    );

    if (existingItem.rows.length > 0) {
      return res.status(409).json({
        error: "Expense item with the same name already exists.",
      });
    }

    // If no existing item, proceed with the insert
    const result = await pool.query(
      `INSERT INTO inventory.expense_item (name, description, unit_id, price, is_active)
         VALUES ($1, $2, $3, $4, TRUE)
         RETURNING *`,
      [name, description, unit_id, price]
    );

    res.status(201).json({
      message: "Expense item created successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({ error: "Failed to create expense item" });
  }
};

module.exports = { createAnExpenseItem };
