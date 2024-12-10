const { Pool } = require("pg");
require("dotenv").config();

const dbconfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
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
