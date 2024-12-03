import express from "express";
import Category from "../models/Category.js";

const categoriesRouter = express.Router();

// region GET

categoriesRouter.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching categories: ", error });
  }
});

export default categoriesRouter
