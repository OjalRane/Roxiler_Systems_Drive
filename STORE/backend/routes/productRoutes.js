const express = require("express");
const {
  seedDatabase,
  fetchTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
} = require("../controllers/productController");

const router = express.Router();

router.get("/seed", seedDatabase);
router.get("/transactions", fetchTransactions);
router.get("/statistics", getStatistics);
router.get("/barchart", getBarChart);
router.get("/piechart", getPieChart);
router.get("/combined", getCombinedData);

module.exports = router;
