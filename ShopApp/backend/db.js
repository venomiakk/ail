import mongoose from "mongoose";


async function connectToDb() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ail_shop1");
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectToDb;
