const Product = require("../models/Product");
const axios = require("axios");

// 1. Seed Database
const seedDatabase = async (req, res) => {
  try {
    const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    await Product.deleteMany(); // Clear database
    await Product.insertMany(response.data); // Seed new data
    res.status(200).json({ message: "Database initialized with seed data" });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed database" });
  }
};

// 2. Fetch Transactions with Pagination and Search
const fetchTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;

  try {
    const filter = { dateOfSale: { $regex: `-${month}-` } };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: { $regex: search, $options: "i" } },
      ];
    }

    const transactions = await Product.find(filter)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const total = await Product.countDocuments(filter);

    res.status(200).json({ transactions, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// 3. Get Statistics
const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const filter = { dateOfSale: { $regex: `-${month}-` } };

    const soldItems = await Product.countDocuments({ ...filter, sold: true });
    const notSoldItems = await Product.countDocuments({ ...filter, sold: false });
    const totalSaleAmount = await Product.aggregate([
      { $match: { ...filter, sold: true } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    res.status(200).json({
      soldItems,
      notSoldItems,
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

// 4. Bar Chart Data
const getBarChart = async (req, res) => {
  const { month } = req.query;

  try {
    const filter = { dateOfSale: { $regex: `-${month}-` } };

    const ranges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const barData = await Promise.all(
      ranges.map(async (range) => {
        const count = await Product.countDocuments({
          ...filter,
          price: { $gte: range.min, $lt: range.max },
        });
        return { range: range.range, count };
      })
    );

    res.status(200).json(barData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bar chart data" });
  }
};

// 5. Pie Chart Data
const getPieChart = async (req, res) => {
  const { month } = req.query;

  try {
    const filter = { dateOfSale: { $regex: `-${month}-` } };

    const pieData = await Product.aggregate([
      { $match: filter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json(pieData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
};

// 6. Combined Data
const getCombinedData = async (req, res) => {
  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      fetchTransactions(req, res),
      getStatistics(req, res),
      getBarChart(req, res),
      getPieChart(req, res),
    ]);

    res.status(200).json({ transactions, statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch combined data" });
  }
};

module.exports = {
  seedDatabase,
  fetchTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
};
