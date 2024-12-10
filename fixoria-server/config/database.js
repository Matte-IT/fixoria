const { Pool } = require("pg");
require("dotenv").config();

const dbconfig = {
  user: "matteitc_u1",
  host: "localhost",
  database: "matteitc_v1",
  password: "@KT55Iyjup4)J5",
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
