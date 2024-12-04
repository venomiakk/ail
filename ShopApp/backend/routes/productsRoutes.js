import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  addProductBodyValidator,
  updateProductBodyValidator,
} from "../validators/productValidators.js";

const productsRouter = express.Router();

//region GET

//* get all products
productsRouter.get("/", async (req, res) => {
  try {
    // pagination
    //TODO add error handling, what if only page num is given?
    const page = parseInt(req.query.p) || 0;
    const total = await Product.countDocuments();
    const limit = parseInt(req.query.n) || total;

    const products = await Product.find()
      .skip(page * limit)
      .limit(limit);

    return res.status(StatusCodes.OK).json({
      status: `${StatusCodes.OK} ${ReasonPhrases.OK}`,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: "Error fetching products!",
      error,
    });
  }
});

//* get product with id
productsRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: `${StatusCodes.BAD_REQUEST} ${ReasonPhrases.BAD_REQUEST}`,
        message: `Invalid product ID: ${id}`,
      });
    }

    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: `${StatusCodes.NOT_FOUND} ${ReasonPhrases.NOT_FOUND}`,
        message: `Product with id: ${id} not found`,
      });
    }
    return res.status(StatusCodes.OK).json({
      status: `${StatusCodes.OK} ${ReasonPhrases.OK}`,
      product,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: `Error fetching product with id: ${id}`,
      error,
    });
  }
});

// region POST

//* add product
productsRouter.post("/", async (req, res) => {
  try {
    const errors = addProductBodyValidator(req.body);
    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: `${StatusCodes.BAD_REQUEST} ${ReasonPhrases.BAD_REQUEST}`,
        errors,
      });
    }

    const { name, description, unit_price, unit_weight, category_name } =
      req.body;

    const category = await Category.findOne({ name: category_name });
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: `${StatusCodes.NOT_FOUND} ${ReasonPhrases.NOT_FOUND}`,
        message: `Category: ${category_name} not found`,
      });
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
    return res.status(StatusCodes.CREATED).json({
      status: `${StatusCodes.CREATED} ${ReasonPhrases.CREATED}`,
      savedProduct,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: `Error adding a product: ${req.body}`,
      error,
    });
  }
});

// region PUT

//* update product
productsRouter.put("/:id", async (req, res) => {
  try {
    const prodId = req.params.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(prodId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: `${StatusCodes.BAD_REQUEST} ${ReasonPhrases.BAD_REQUEST}`,
        message: `Invalid product ID: ${prodId}`,
      });
    }

    const errors = updateProductBodyValidator(updates);
    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: `${StatusCodes.BAD_REQUEST} ${ReasonPhrases.BAD_REQUEST}`,
        errors,
      });
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
      return res.status(StatusCodes.NOT_FOUND).json({
        status: `${StatusCodes.NOT_FOUND} ${ReasonPhrases.NOT_FOUND}`,
        message: `Product with id: ${prodId} not found`,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: `${StatusCodes.OK} ${ReasonPhrases.OK}`,
      updatedProduct,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: "Error updating a product",
      error,
    });
  }
});

export default productsRouter;
