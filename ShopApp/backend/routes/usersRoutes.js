import express from "express";
import User from "../models/User.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const usersRouter = express.Router();

// region GET

//* get all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(StatusCodes.OK)
      .json({ status: `${StatusCodes.OK} ${ReasonPhrases.OK}`, users });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: `${StatusCodes.INTERNAL_SERVER_ERROR} ${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
      message: "Error fetching users: ",
      error,
    });
  }
});

export default usersRouter;
