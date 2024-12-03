import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  unit_price: { type: Number, required: true },
  unit_weight: { type: Number, required: true },
  category_id: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
