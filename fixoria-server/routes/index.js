const router = require("express").Router();
const upload = require("../file-middleware/upload");

// Routers
const categoryRouter = require("./categoryRoutes");
const unitRouter = require("./unitRoutes");
const productRouter = require("./productRoutes");
const partyRouter = require("./partyRoutes");
const purchaseRouter = require("./purchaseRoutes");
const purchaseOrderRouter = require("./purchaseOrderRouts");
const salesRouter = require("./saleRoutes");
const salesOrdersRouter = require("./saleOrdersRoutes");
const expenseItemsRouter = require("./expenseItems");
const expenseRouter = require("./expenseRoutes");
const paymentTypeRouter = require("./paymentTypeRoutes");
const paymentInRouter = require("./paymentInRoutes");

// Category Route
router.use("/api/category", categoryRouter);

// Unit Route
router.use("/api/unit", unitRouter);

// product
router.use("/api/product", productRouter);

// Party Routes
router.use("/api/party", partyRouter);

// purchase routes
router.use("/api/purchase", purchaseRouter);

// purchase order routes
router.use("/api/purchase-order", purchaseOrderRouter);

// sales routes
router.use("/api/sales", salesRouter);

// sales orders routes
router.use("/api/sales-order", salesOrdersRouter);

// Expense Items routes
router.use("/api/expense-items", expenseItemsRouter);

// Expense routes
router.use("/api/expense", upload.single("file"), expenseRouter);

// Payment Type routes
router.use("/api/payment-type", paymentTypeRouter);

// Payment In routes
router.use("/api/payment-in", paymentInRouter);

module.exports = router;
