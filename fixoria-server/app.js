require("dotenv").config();
const express = require("express");
const cors = require("cors");
const categoryRouter = require("./routes/categoryRoutes");
const unitRouter = require("./routes/unitRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
// Category Route
app.use("/category", categoryRouter);

// Unit Route
app.use("/unit", unitRouter);

app.get("/", (req, res) => {
  res.send("Welcome To Fixoria!");
});
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
