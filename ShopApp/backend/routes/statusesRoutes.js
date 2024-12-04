import express from "express";
import OrderStatus from "../models/OrderStatus.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const statusesRouter = express.Router();

// region GET

//* get all statuses
statusesRouter.get("/", async (req, res) => {
  try {
    const orderStatuses = await OrderStatus.find();
    return res
      .status(StatusCodes.OK)
      .json({ status: `${StatusCodes.OK} ${ReasonPhrases.OK}`, orderStatuses });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: "Error fetching order statuses: ",
      error,
    });
  }
});

export default statusesRouter;
