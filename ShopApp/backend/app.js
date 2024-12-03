import express from "express";
import connectToDb from "./db.js";
import Product from "./models/Product.js";
import OrderStatus from "./models/OrderStatus.js";
import User from "./models/User.js";
import Order from "./models/Order.js";
import Category from "./models/Category.js";

//init app & middleware
const app = express();

// connection to database
connectToDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database: ", error);
    process.exit(1);
  });

// routes
app.get("/test", (req, res) => {
  res.json({ mssg: "Test route" });
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

app.get("/orderstatuses", async (req, res) => {
  try {
    const orderStatuses = await OrderStatus.find();
    res.json(orderStatuses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order statuses: ", error });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users: ", error });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders: ", error });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories: ", error });
  }
});
