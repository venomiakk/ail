import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
import Product from "../models/Product.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  addOrderBodyUserValidator,
  updateOrderStatusValidator,
  addOrderItemsValidator,
} from "../validators/orderValidators.js";

const ordersRouter = express.Router();

// region GET

//* get all orders
ordersRouter.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    return res
      .status(StatusCodes.OK)
      .json({ status: `${StatusCodes.OK} ${ReasonPhrases.OK}`, orders });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: "Error fetching orders",
      error,
    });
  }
});

//* get orders with given status
ordersRouter.get("/status/:id", async (req, res) => {
  try {
    let status_id = req.params.id.toLowerCase();
    const status_id_regex = /^status\d+$/;
    if (!status_id_regex.test(status_id)) {
      status_id = status_id.toUpperCase();
      status_id = await OrderStatus.findOne({ name: status_id });
      if (!status_id) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: `${StatusCodes.NOT_FOUND} ${ReasonPhrases.NOT_FOUND}`,
          message: `Order status ${status_id} not found`,
        });
      }
      status_id = status_id._id;
    }

    const orders = await Order.find({ status_id: status_id });
    if (orders.length <= 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: `${StatusCodes.NOT_FOUND} ${ReasonPhrases.NOT_FOUND}`,
        message: `No orders with status ${status_id}`,
      });
    }
    return res
      .status(StatusCodes.OK)
      .json({ status: `${StatusCodes.OK} ${ReasonPhrases.OK}`, orders });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: `Error fetching orders with given status ${status_id}`,
      error,
    });
  }
});

// region POST

//* add order
ordersRouter.post("/", async (req, res) => {
  //TODO could take price from products
  try {
    const userFieldsErrors = addOrderBodyUserValidator(req.body);
    if (userFieldsErrors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: `${StatusCodes.BAD_REQUEST} ${ReasonPhrases.BAD_REQUEST}`,
        userFieldsErrors,
      });
    }
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

    const itemsErrors = await addOrderItemsValidator(items);

    if (itemsErrors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: `${StatusCodes.BAD_REQUEST} ${ReasonPhrases.BAD_REQUEST}`,
        message: "Order not added",
        itemsErrors,
      });
    }

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
    return res.status(StatusCodes.CREATED).json({
      status: `${StatusCodes.CREATED} ${ReasonPhrases.CREATED}`,
      savedOrder,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: "Error adding an order",
      error,
    });
  }
});

// region PATCH

//* update order state
ordersRouter.patch("/:id", async (req, res) => {
  try {
    const order_id = req.params.id;
    const updates = req.body;
    const newstatus_id = req.body.status_id;
    if (!mongoose.Types.ObjectId.isValid(order_id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: `${StatusCodes.BAD_REQUEST} ${ReasonPhrases.BAD_REQUEST}`,
        message: `Invalid order ID: ${order_id}`,
      });
    }

    let oldstatus_id = await Order.findById(order_id);
    if (!oldstatus_id) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: `${StatusCodes.NOT_FOUND} ${ReasonPhrases.NOT_FOUND}`,
        message: `Order with id ${order_id} not found`,
      });
    }
    oldstatus_id = oldstatus_id.status_id;

    const statusErrors = updateOrderStatusValidator(newstatus_id, oldstatus_id);
    if (statusErrors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: `${StatusCodes.BAD_REQUEST} ${ReasonPhrases.BAD_REQUEST}`,
        message: "Order not updated",
        statusErrors,
      });
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
      return res.status(StatusCodes.NOT_FOUND).json({
        status: `${StatusCodes.NOT_FOUND} ${ReasonPhrases.NOT_FOUND}`,
        message: `Order with id ${order_id} not found`,
      });
    }

    return res
      .status(StatusCodes.OK)
      .json({ status: `${StatusCodes.OK} ${ReasonPhrases.OK}`, updatedOrder });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: "Error updating order status",
      error,
    });
  }
});

export default ordersRouter;
