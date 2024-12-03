import mongoose from "mongoose";

const orderStatusSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
});

const OrderStatus = mongoose.model("Order_Status", orderStatusSchema);

export default OrderStatus;
