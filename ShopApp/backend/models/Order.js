import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  items: { type: [itemSchema], required: true },
  status_id: { type: String, ref: "OrderStatus", required: true },
  date_approved: { type: Date, default: null },
  date_ordered: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
