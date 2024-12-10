require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    // origin: ["http://localhost:5173"],
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Router
const categoryRouter = require("./routes/categoryRoutes");
const unitRouter = require("./routes/unitRoutes");
const productRouter = require("./routes/productRoutes");
const partyRouter = require("./routes/partyRoutes");

// Category Route
app.use("/fixoria-server/category", categoryRouter);

// Unit Route
app.use("/fixoria-server/unit", unitRouter);

// product
app.use("/fixoria-server/product", productRouter);

// Party Routes
app.use("/fixoria-server/party", partyRouter);

app.get("/fixoria-server", (req, res) => {
  res.send("Welcome To Fixoria server!");
});

// jahid loves a pakistani girl :D
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

// changes make to check ci/cd
// testing - 2
