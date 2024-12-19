const router = require("express").Router();

// Routers
const categoryRouter = require("./categoryRoutes");
const unitRouter = require("./unitRoutes");
const productRouter = require("./productRoutes");
const partyRouter = require("./partyRoutes");
const purchaseRouter = require("./purchaseRoutes");
const purchaseOrderRouter = require("./purchaseOrderRouts");
const salesRouter = require("./saleRoutes");
const salesOrdersRouter = require("./saleOrdersRoutes");

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

module.exports = router;
