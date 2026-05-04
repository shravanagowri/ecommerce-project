import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Order from "./models/Order.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// CONNECT DB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// CREATE ORDER
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ORDERS
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});