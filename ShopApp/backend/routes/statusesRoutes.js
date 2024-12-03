import express from "express";
import OrderStatus from "../models/OrderStatus.js";

const statusesRouter = express.Router()

// region GET

statusesRouter.get("/", async (req, res) => {
  try {
    const orderStatuses = await OrderStatus.find();
    return res.status(200).json(orderStatuses);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching order statuses: ", error });
  }
});

export default statusesRouter