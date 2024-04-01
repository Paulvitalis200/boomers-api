import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import UserCode from '../models/userCodeModel';
import jwt from 'jsonwebtoken';

//@desc Sign in a user
//@route POST /api/users/signin
//access public
const signInUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate Auth Code
    const authCode = generateAuthCode();

    // Hash the Auth Code
    const hashedAuthCode = await bcrypt.hash(authCode, 10);

    // Store the hashed authentication code in the database
    await UserCode.create({ userId: user._id, signinCode: hashedAuthCode });

    res.status(200).json({ message: 'Sign in successful', authCode });
  } catch (error: any) {
    throw new Error(error);
  }
});

//@desc Verify Auth Code
//@route POST /api/users/verify-code
//access public
export const verifyUserCode = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email, authCode } = req.body;

      if (!email || !authCode) {
        res
          .status(400)
          .json({ message: 'Please provide both email and verification code' });
        return;
      }

      const user = await User.findOne({ email });

      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      const signInAuthCode = await UserCode.findOne({
        userId: user._id,
      });

      if (!signInAuthCode) {
        res.status(400).json({ message: 'No authentication code found' });
        return;
      }

      // Check if the code has expired
      const createdDate: any = signInAuthCode._id.getTimestamp();
      const currentDate: any = new Date();
      const diffTime = Math.abs(createdDate - currentDate);
      const fiveminutes = 1000 * 60 * 5;
      console.log(createdDate);
      if (diffTime > fiveminutes) {
        await UserCode.findByIdAndDelete(signInAuthCode._id);
        res.status(400).json({ error: 'Authentication code expired' });
        return;
      }

      // Compare the entered code with the hashed code retrieved from the database
      const isCodeValid = await bcrypt.compare(
        authCode,
        signInAuthCode.signinCode
      );

      if (!isCodeValid) {
        res.status(400).json({ message: 'Incorrect code' });
        return;
      }

      // Delete the authentication code from the database
      await UserCode.deleteOne({ userId: user._id });

      // Create a JWT token with an expiration time of 1 hour
      const token = jwt.sign({ userId: user._id }, 'token_secret', {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Code verified successfully', token });
    } catch (error: any) {
      res.status(400).json({ error: error });
    }
  }
);

// Function to generate a random authentication code
const generateAuthCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default signInUser;
