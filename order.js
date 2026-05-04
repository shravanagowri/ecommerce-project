import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  address: Object,
  payment: String,
  status: String
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);