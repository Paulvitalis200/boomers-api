import { Request, Response } from "express";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import * as EmailValidator from "email-validator";

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

  if (email) {
    const isValid = EmailValidator.validate(email);

    if (!isValid) {
      res.status(400);
      throw new Error("Email is not valid");
    }
  }
  const userAvailable = await User.findOne({
    $or: [{ email: userSearchValue }, { phoneNumber: userSearchValue }],
  });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  let user;
  if (email) {
    user = await User.create({
      password: hashPassword,
      email,
    });
  } else {
    user = await User.create({
      password: hashPassword,
      phoneNumber,
    });
  }

  if (user) {
    res.status(201).json({
      successful: true,
      statusCode: parseInt("00"),
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid.");
  }
  res.json({ message: "Register the user" });
});

export default registerUser;
