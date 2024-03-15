import { Request, Response } from "express";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import * as EmailValidator from "email-validator";
import UserCode from "../models/userCodeModel";
import nodemailer from "nodemailer";

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

    if (email) {
      const isValid = EmailValidator.validate(email);

      if (!isValid) {
        res.status(400);
        throw new Error("Email is not valid");
      }
    }
    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      password: hashPassword,
      email,
    });

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

    const hashedPassword = await UserCode.find({ email: { $in: [email] } });

    if (!hashedPassword.length) {
      res.status(400).json({ error: "User does not exist." });
      return;
    }
    const isCorrect = await bcrypt.compare(code, hashedPassword[0].code);
    const createdDate: any = hashedPassword[0]._id.getTimestamp();
    const currentDate: any = new Date();
    const diffTime = Math.abs(createdDate - currentDate);
    const twentyFourHours = 1000 * 60 * 60 * 24;

    if (diffTime > twentyFourHours) {
      await UserCode.findByIdAndDelete(hashedPassword[0]._id);
      res.status(400).json({ error: "User code expired" });
      return;
    } else {
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
    }
  } catch (error: any) {
    res.status(400).json({ error: error });
  }
});

export const resendVerificationCode = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: { $in: [email] } });

      if (user) {
        if (!user.isVerified) {
          const codeAvailable = await UserCode.findOne({
            email: { $in: [email] },
          });
          if (codeAvailable) {
            res.status(400).json({ error: "User Code exists" });
            return;
          }
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
          res.status(400).json({ error: "User is already verified!" });
        }
      } else {
        res.status(400).json({ error: "User does not exist" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error });
    }
  }
);

function generateRandomNumber(): string {
  const min = 100000;
  const max = 999999;
  const generateRandomNumber =
    Math.floor(Math.random() * (max - min + 1)) + min;
  return generateRandomNumber.toString();
}

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "api",
    pass: "a4009212148d4e1e4ec59bd45aa47d56",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "info@boomer-ville.com", // sender address
    to: "vitalispaul48@live.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

export default registerUser;
