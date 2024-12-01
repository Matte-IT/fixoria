const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Failed to connect to the database:", err.stack);
  } else {
    console.log("✅ Connected to the database successfully!");
  }
  if (release) release();
});

module.exports = pool;
