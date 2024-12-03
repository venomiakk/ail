import express from 'express'
import User from "../models/User.js";

const usersRouter = express.Router()

// region GET

usersRouter.get("/", async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users: ", error });
    }
  });
  
export default usersRouter