const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Create Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection URI
const mongoURI = "mongodb+srv://ojalrane07:ojalrane07@portfolio.r6gwq.mongodb.net/Portfolio?retryWrites=true&w=majority";

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit the application if connection fails
  }
}

connectDB();

// Create a Schema
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

// Create a Model
const Item = mongoose.model("Item", ItemSchema);

// API Endpoints
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Create Item
app.post("/api/items", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newItem = new Item({ name, price, description });
    await newItem.save();
    res.status(201).json({ message: "Item created", newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
