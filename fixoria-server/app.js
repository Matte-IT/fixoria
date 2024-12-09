require("dotenv").config();
const express = require("express");
const cors = require("cors");

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

// Router
const categoryRouter = require("./routes/categoryRoutes");
const unitRouter = require("./routes/unitRoutes");
const productRouter = require("./routes/productRoutes");
const partyRouter = require("./routes/partyRoutes");

// Category Route
app.use("/fixoria/fixoria-server/category", categoryRouter);

// Unit Route
app.use("/fixoria/fixoria-server/unit", unitRouter);

// product
app.use("/fixoria/fixoria-server/product", productRouter);

// Party Routes
app.use("/fixoria/fixoria-server/party", partyRouter);

app.get("/fixoria/fixoria-server", (req, res) => {
  res.send("Welcome To Fixoria server!");
});

app.get("/", (req, res) => {
  res.send("Test route is working!");
});

// jahid loves a pakistani girl :D
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
