import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const productsRouter = express.Router();

//region GET

productsRouter.get("/", async (req, res) => {
  try {
    // pagination
    // TODO add error handling, what if only page num is given?
    const page = parseInt(req.query.p) || 0;
    const total = await Product.countDocuments();
    const limit = parseInt(req.query.n) || total;

    const products = await Product.find()
      .skip(page * limit)
      .limit(limit);

    return res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching product: ", error });
  }
});

// region POST

productsRouter.post("/", async (req, res) => {
  try {
    const { name, description, unit_price, unit_weight, category_name } =
      req.body;

    const category = await Category.findOne({ name: category_name });
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }
    const category_id = category._id;

    const newProduct = new Product({
      name,
      description,
      unit_price,
      unit_weight,
      category_id,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error adding a product: ", error });
  }
});

// region PUT

productsRouter.put("/:id", async (req, res) => {
  try {
    const prodId = req.params.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(prodId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      prodId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error updating a product", error });
  }
});

export default productsRouter;
