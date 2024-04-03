import { Request, Response } from "express";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import * as EmailValidator from "email-validator";
import UserVerificationCode from "../models/userVerificationCodeModel";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import UserProfile from "../models/userProfileModel";

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

    if (email && phoneNumber) {
      res.status(400);
      throw new Error("Please select either email or phone number");
    }

    let userAvailable;
    if (email) {
      const isValid = EmailValidator.validate(email);

      if (!isValid) {
        res.status(400);
        throw new Error("Email is not valid");
      }
      userAvailable = await User.findOne({ email });
    }

    if (phoneNumber) {
      userAvailable = await User.findOne({ phoneNumber });
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

    if (userAvailable) {
      res.status(409);
      throw new Error("User already registered!");
    }

    const user = await User.create({
      password: hashPassword,
      email,
      phoneNumber,
    });

    if (user) {
      const unhashedCode = generateRandomNumber();
      const hashCode = await bcrypt.hash(unhashedCode, 10);

      const userCode = await UserVerificationCode.create({
        code: hashCode,
        phoneNumber,
        email,
        userId: user.id,
      });

      res.status(201).json({
        successful: true,
        verificationCode: unhashedCode,
      });
      if (email) {
        const emailTemplate = `<div>
        <p>Hi,</p>
        <p>Thank you for signing up to Boomers.</p>
        <p>Your verification code is: </p>
        <h2>${unhashedCode}</h2>
        <p>This code will expire in 24 hours.</p>
        </div>`;
        sendMail(transporter, email, emailTemplate);
      }
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
    const { email, phoneNumber, verificationCode } = req.body;

    if (!email && !phoneNumber) {
      res.status(400);
      throw new Error("Please put an email or phone number");
    }

    if (email && phoneNumber) {
      res.status(400);
      throw new Error("Please select either email or phone number");
    }

    let hashedVerificationCode;
    let user;
    if (email) {
      hashedVerificationCode = await UserVerificationCode.findOne({
        email: { $in: [email] },
      });
      user = await User.findOne({
        email,
      });
    } else {
      hashedVerificationCode = await UserVerificationCode.findOne({
        phoneNumber: { $in: [phoneNumber] },
      });
      user = await User.findOne({
        phoneNumber,
      });
    }

    if (!hashedVerificationCode) {
      if (!user) {
        res.status(400).json({ error: "User does not exist." });
        return;
      } else {
        res.status(400).json({ error: "User already verified." });
        return;
      }
    }

    const isCorrect = await bcrypt.compare(
      verificationCode.toString(),
      hashedVerificationCode.code
    );

    const createdDate: any = hashedVerificationCode._id.getTimestamp();
    const currentDate: any = new Date();
    const diffTime = Math.abs(createdDate - currentDate);
    const twentyFourHours = 1000 * 60 * 60 * 24;

    if (diffTime > twentyFourHours) {
      await UserVerificationCode.findByIdAndDelete(hashedVerificationCode._id);
      res.status(400).json({ error: "User code expired" });
      return;
    } else {
      if (isCorrect) {
        const updateUser = await User.findByIdAndUpdate(user?._id, {
          isVerified: true,
        });

        const isVerified = await UserVerificationCode.findByIdAndDelete(
          hashedVerificationCode._id
        );

        if (isVerified) {
          if (email) {
            const emailTemplate = `<div>
            <p>Hi,</p>
            <p>Your email has been verified successfully!</p>
            <p>Best,</p>
            <p>Boomers Support</p>
          </div>`;
            sendMail(transporter, email, emailTemplate);
          }
          await UserProfile.create({
            userId: user?._id,
            email,
            phoneNumber,
          });
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
//@route POST /api/users/resend-verification
//access public
export const resendVerificationCode = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email, phoneNumber } = req.body;

      let user;
      if (email) user = await User.findOne({ email: { $in: [email] } });

      if (phoneNumber)
        user = await User.findOne({ phoneNumber: { $in: [phoneNumber] } });

      if (!email && !phoneNumber) {
        res.status(400);
        throw new Error("Please put an email or phone number");
      }

      if (email && phoneNumber) {
        res.status(400);
        throw new Error("Please select either email or phone number");
      }

      if (user) {
        if (!user.isVerified) {
          let codeAvailable;
          if (email) {
            codeAvailable = await UserVerificationCode.findOne({
              email: { $in: [email] },
            });
          } else {
            codeAvailable = await UserVerificationCode.findOne({
              phoneNumber: { $in: [phoneNumber] },
            });
          }

          if (codeAvailable) {
            const unhashedCode = generateRandomNumber();
            const hashCode = await bcrypt.hash(unhashedCode, 10);
            const userCode = await UserVerificationCode.findByIdAndUpdate(
              codeAvailable._id,
              {
                code: hashCode,
              },
              { new: true }
            );
            if (email) {
              const emailTemplate = `<div>
              <p>Hi,</p>
              <p>You requested a new verification code.</p>
              <p>Your verification code is: </p>
              <h2>${unhashedCode}</h2>
              <p>This code will expire in 24 hours.</p>
            </div>`;
              sendMail(transporter, email, emailTemplate);
            }
            res.status(201).json({
              successful: true,
              verificationCode: unhashedCode,
            });
            return;
          }
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

//@desc Get user
//@route GET /api/users/:id
//access public
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    throw new Error(error);
  }
});

//@desc Get all users
//@route GET /api/users
//access public
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});
  res.status(200).json(users);
});

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
