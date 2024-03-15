import { Request, Response } from "express";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import * as EmailValidator from "email-validator";
import UserCode from "../models/userCodeModel";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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
    if (!password.trim()) {
      res.status(400);
      throw new Error("Please put a password");
    }

    if (email) {
      const isValid = EmailValidator.validate(email);

      if (!isValid) {
        res.status(400);
        throw new Error("Email is not valid");
      }
    }
    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
      res.status(409);
      throw new Error("User already registered!");
    }

    const regexPattern =
      /^(?=.*[-\#\$\.\%\&\@\!\+\=\<\>\*])(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

    if (!password.trim().match(regexPattern)) {
      res.status(400).json({
        error:
          "Password must be 8-15 characters, have at least one alphabet (uppercase or lowercase), have at least one number present and have at least one special character (-,.,@,$,!,%,+,=,<,>,#,?,&)",
      });
      return;
    }

    const hashPassword = await bcrypt.hash(password.trim(), 10);

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
        verificationCode: unhashedCode,
      });
      const emailTemplate = `<div>
      <p>Hi,</p>
      <p>Thank you for signing up to Boomers.</p>
      <p>Your verification code is: </p>
      <h2>${unhashedCode}</h2>
      <p>This code will expire in 24 hours.</p>
      </div>`;
      sendMail(transporter, email, emailTemplate);
    } else {
      res.status(400).json({ error: "User not registered." });
    }
  } catch (error: any) {
    throw new Error(error);
  }
});

//@desc Verify a user
//@route POST /api/users/verify
//access public
export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;

    const hashedPassword = await UserCode.find({ email: { $in: [email] } });

    if (!hashedPassword.length) {
      res.status(400).json({ error: "User does not exist." });
      return;
    }
    const isCorrect = await bcrypt.compare(
      verificationCode,
      hashedPassword[0].code
    );
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
          const emailTemplate = `<div>
                        <p>Hi,</p>
                        <p>Your email has been verified successfully!</p>
                        <p>Best,</p>
                        <p>Boomers Support</p>
                      </div>`;
          sendMail(transporter, email, emailTemplate);
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

//@desc Resend verification code to user
//@route POST /api/users/resend-code
//access public
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
            const unhashedCode = generateRandomNumber();
            const hashCode = await bcrypt.hash(unhashedCode, 10);
            const userCode = await UserCode.findByIdAndUpdate(
              codeAvailable._id,
              {
                code: hashCode,
              },
              { new: true }
            );
            const emailTemplate = `<div>
            <p>Hi,</p>
            <p>Thank you for signing up to Boomers.</p>
            <p>Your verification code is: </p>
            <h2>${unhashedCode}</h2>
            <p>This code will expire in 24 hours.</p>
          </div>`;
            sendMail(transporter, email, emailTemplate);
            res.status(201).json({
              successful: true,
              verificationCode: unhashedCode,
            });
            return;
          }
          const unhashedCode = generateRandomNumber();
          const hashCode = await bcrypt.hash(unhashedCode, 10);
          const userCode = await UserCode.create({
            code: hashCode,
            email,
            userId: user.id,
          });
          const emailTemplate = `<div>
                        <p>Hi,</p>
                        <p>Thank you for signing up to Boomers.</p>
                        <p>Your verification code is: </p>
                        <h2>${unhashedCode}</h2>
                        <p>This code will expire in 24 hours.</p>
                      </div>`;
          sendMail(transporter, email, emailTemplate);
          res.status(201).json({
            successful: true,
            verificationCode: unhashedCode,
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
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (transporter: any, user: any, template: any) => {
  const mailOptions = {
    from: {
      name: "Boomers",
      address: process.env.USER_EMAIL,
    }, // sender address
    to: [user], // list of receivers
    subject: "Verification Code", // Subject line
    html: template,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error);
  }
};

export default registerUser;
