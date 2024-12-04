import express from "express";
import Category from "../models/Category.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const categoriesRouter = express.Router();

// region GET

//* get all categories
categoriesRouter.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    return res
      .status(StatusCodes.OK)
      .json({ status: `${StatusCodes.OK} ${ReasonPhrases.OK}`, categories });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: "Error fetching categories: ",
      error,
    });
  }
});

export default categoriesRouter;
