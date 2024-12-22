const pool = require("../../config/database");

async function updateProduct(req, res) {
  console.log(req.body, "updateProduct");
  res.send("updateProduct");
}

module.exports = { updateProduct };
