const router = require("express").Router();
const { getAllUnits } = require("../controllers/unit/getAllUnits");

router
  // Get All Units
  .get("/", getAllUnits);

module.exports = router;
