import { Request, Response } from "express";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

//@desc Register a user
//@route POST /api/users/register
//access public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, email, password } = req.body;
  if (!email && !phoneNumber) {
    res.status(400);
    throw new Error("Please put an email or phone number");
  }
  if (!password) {
    res.status(400);
    throw new Error("Please put a password");
  }
  const userSearchValue = email ? email : phoneNumber;
  const userAvailable = await User.findOne({ userSearchValue });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    password: hashPassword,
    email,
    phoneNumber,
  });
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid.");
  }
  res.json({ message: "Register the user" });
});

export default registerUser;
