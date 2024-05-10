import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/validateTokenHandler";
import TeamChallenge from "../models/teamChallengeModel";

//@desc Get Challenges
//@route GET /api/challenges
//access private
export const getAllChallenges = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const challenges = await TeamChallenge.find({});

      res.status(200).json({ message: "successful", data: challenges });
    } catch (error: any) {
      console.log(error);
    }
  }
);

//@desc Get Challenges
//@route GET /api/challenges/:id
//access private
export const getChallenge = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const challenge = await TeamChallenge.findById({ _id: req.params.id });

      if (!challenge) {
        res.status(404).json({ message: "Challenge not found" });
      } else {
        res.status(200).json({ message: "successful", data: challenge });
      }
    } catch (error: any) {
      console.log(error);
    }
  }
);
