import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import UserProfile from "../models/userProfileModel";

dotenv.config();

//@desc Get user
//@route GET /api/users/:id/profile
//access public
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.id });

    if (!profile) {
      res.status(404).json({ message: "User profile does not exist" });
      return;
    }
    res.status(200).json({
      successful: true,
      profile,
    });
  } catch (error: any) {
    throw new Error(error);
  }
});

//@desc Update user profile
//@route PUT /api/users/:id/profile
//access private
export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.id });
    if (!profile) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      profile._id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedProfile);
  } catch (error: any) {
    throw new Error(error);
  }
});
