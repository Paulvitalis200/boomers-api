import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import * as EmailValidator from "email-validator";
import UserVerificationCode from "../models/userVerificationCodeModel";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import UserProfile from "../models/userProfileModel";
import { CustomRequest } from "../middleware/validateTokenHandler";
import Token from "../models/tokenModel";
import { Schema } from "mongoose";

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
            email,
            phoneNumber,
            user_id: user?.id,
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

//@desc Get current user info
//@route GET /api/users
//access private
export const currentUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    res.json(req.user);
  }
);

//@desc Forgot password
//@route POST /api/forgot-password
//access public

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    // Check if the user exists in the database:
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const saltRounds = 10;

    // Generate salt and hash the token
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(resetToken, salt);

    // Save token to the database
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    // Send email with the reset link
    const url = "http://localhost:5000";
    const emailTemplate = `
            <div>
                <h2>Hi ${email}</h2>
                <p>You requested to reset your password</p>
                <p>Please click on the below link to reset your password</p>
                <a href="${url}/passwordReset?token=${resetToken}&id=${user._id}">Reset Password</a>
            </div>`;
    // Assuming you have a function sendMail defined somewhere
    // sendMail(transporter, email, emailTemplate);
    res.status(200).json({
      message: "Reset password email sent successfully",
      data: `${url}/passwordReset?token=${resetToken}&id=${user._id}`,
    });
  } catch (error: any) {
    res.status(400).json({ error: error });
  }
};

//@desc Reset password
//@route POST /api/reset-password
//access public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Extract userId, token, and newPassword from request body
    const { userId, token, password } = req.body;

    // Check if the password reset token exists for the user
    const passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      return res
        .status(404)
        .json({ message: "Invalid or expired password reset token" });
    }

    // Compare the provided token with the stored hashed token
    const isValidToken = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValidToken) {
      return res
        .status(404)
        .json({ message: "Invalid or expired password reset token" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password
    await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );

    // Delete the password reset token
    await passwordResetToken.deleteOne();

    // Return success response
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

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
