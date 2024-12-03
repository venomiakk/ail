import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";

const ordersRouter = express.Router();

// region GET

ordersRouter.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders: ", error });
  }
});

ordersRouter.get("/status/:id", async (req, res) => {
  try {
    let status_id = req.params.id.toLowerCase();
    const status_id_regex = /^status\d+$/;
    if (!status_id_regex.test(status_id)) {
      status_id = status_id.toUpperCase();
      status_id = await OrderStatus.findOne({ name: status_id });
      if (!status_id) {
        return res.status(404).json({ message: "Order status not found" });
      }
      status_id = status_id._id;
    }
    console.log(status_id);
    const orders = await Order.find({ status_id: status_id });
    console.log(orders.length);
    if (orders.length <= 0) {
      return res.status(404).json({ message: "No orders with this status" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching orders with given status: ", error });
  }
});

// region POST

ordersRouter.post("/", async (req, res) => {
  // TODO fewer parems, some of them are necessary
  try {
    const {
      user_id,
      user_name,
      email,
      phone,
      items,
      status_id,
      date_approved,
      date_ordered,
    } = req.body;

    const newOrder = new Order({
      user_id,
      user_name,
      email,
      phone,
      items,
      status_id,
      date_approved,
      date_ordered,
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({ message: "Error adding an order", error });
  }
});

// region PATCH

ordersRouter.patch("/:id", async (req, res) => {
  // TODO allow to only change order status
  try {
    const order_id = req.params.id;
    const updates = req.body;
    if (!mongoose.Types.ObjectId.isValid(order_id)) {
      return res.status(500).json({ message: "Invalid order ID" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating order status", error });
  }
});

export default ordersRouter;
