import { Request, Response } from "express";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import * as EmailValidator from "email-validator";
import UserCode from "../models/userCodeModel";

//@desc Register a user
//@route POST /api/users/register
//access public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  try {
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
    console.log("HEREß");
    if (email) {
      console.log("NDANI");
      const isValid = EmailValidator.validate(email);

      if (!isValid) {
        console.log("NOT VALID");
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

    console.log("EMAIL");
    const user = await User.create({
      password: hashPassword,
      email,
    });

    console.log("RUIGT HERE");
    if (user) {
      const unhashedCode = generateRandomNumber();
      const hashCode = await bcrypt.hash(unhashedCode, 10);

      const userCode = await UserCode.create({
        code: hashCode,
        email,
        userId: user.id,
      });
      res.status(201).json({
        successful: true,
        userCode,
        unhashedCode,
      });
    } else {
      res.status(400);
      throw new Error("User data is not valid.");
    }
  } catch (error: any) {
    throw new Error(error);
  }
});

export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    console.log("EMAIL: ", email);
    console.log("BODYT: ", req.body);

    const hashedPassword = await UserCode.find({ email: { $in: [email] } });

    console.log("NEW: ", hashedPassword);
    const isCorrect = await bcrypt.compare(code, hashedPassword[0].code);

    if (isCorrect) {
      const user = await User.findOne({
        email,
      });

      const updateUser = await User.findByIdAndUpdate(user?._id, {
        isVerified: true,
      });

      const isVerified = await UserCode.findByIdAndDelete(
        hashedPassword[0]._id
      );

      if (isVerified) {
        res.status(200).json({ successful: true, message: "User verified!" });
      }
    } else {
      res.status(400).json({ error: "User code invalid" });
    }
  } catch (error: any) {
    console.log(error);

    res.status(400).json({ error: error });
  }
});

function generateRandomNumber(): string {
  const min = 100000;
  const max = 999999;
  const generateRandomNumber =
    Math.floor(Math.random() * (max - min + 1)) + min;
  return generateRandomNumber.toString();
}

export default registerUser;
