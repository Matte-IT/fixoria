const pool = require("../../config/database");

// Create A product
const createProduct = async (req, res) => {
  console.log(req.body);
  res.send(req.body);
};

module.exports = { createProduct };
