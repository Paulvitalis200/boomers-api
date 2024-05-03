import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import UserProfile from "../models/userProfileModel";

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

    const { phoneNumber, firstName, lastName, bio, interests } = req.body;
    let updateProfileBody = {
      phoneNumber: profile.phoneNumber,
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      interests: profile.interests,
    };

    // if (username && username.trim().length > 0)
    //   updateProfileBody.username = username.trim();

    if (phoneNumber && phoneNumber.trim().length > 0)
      updateProfileBody.phoneNumber = phoneNumber.trim();

    if (firstName && firstName.trim().length > 0)
      updateProfileBody.firstName = firstName.trim();

    if (lastName && lastName.trim().length > 0)
      updateProfileBody.lastName = lastName.trim();

    if (bio && bio.trim().length > 0) updateProfileBody.bio = bio.trim();

    if (interests && typeof interests === "object")
      updateProfileBody.interests = interests;

    if (!interests && !phoneNumber && !firstName && !lastName && !bio) {
      res.status(400);
      throw new Error("Please put a valid value");
    }

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      profile._id,
      {
        firstName: updateProfileBody.firstName,
        lastName: updateProfileBody.lastName,
        phoneNumber: updateProfileBody.phoneNumber,
        bio: updateProfileBody.bio,
        interests: updateProfileBody.interests,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedProfile);
  } catch (error: any) {
    throw new Error(error);
  }
});
