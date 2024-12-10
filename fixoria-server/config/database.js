const { Pool } = require("pg");
require("dotenv").config();

const dbconfig = {
  user: "matteitc",
  host: "localhost",
  database: "matteitc_miniaccv1",
  password: "H)~O-3[B+2I9",
};

const pool = new Pool(dbconfig);

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Failed to connect to the database:", err.stack);
  } else {
    console.log("✅ Connected to the database successfully!");
  }
  if (release) release();
});

module.exports = pool;
