require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://fixoria.matteit.com/"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Add this line to serve the uploads directory statically
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// root route
app.get("/api", (req, res) => {
  res.send("Welcome To Fixoria server!");
});

// all routes
app.use(require("./routes"));

// error handler
app.use((req, res) => {
  res.status(404).send("Route not found!");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
