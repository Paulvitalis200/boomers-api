import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Team from "../../models/teamModel";
import { CustomRequest } from "../../middleware/validateTokenHandler";
import TeamChallenge from "../../models/teamChallengeModel";

//@desc Post Challenge
//@route POST /api/teams/challenge
//access private
export const createTeamChallenge = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const {
        challenge_name,
        team_id,
        due_date,
        difficulty,
        description,
        resources,
        image_url,
        reward,
      } = req.body;

      const teamExists = await Team.findById({ _id: team_id.trim() });

      if (!teamExists) {
        res.status(404);
        throw new Error("Team does not exist");
      }

      if (req.user.id !== teamExists.owner_id.toString()) {
        res.status(403);
        throw new Error("User does not own the team");
      }

      const currentDate = new Date();

      if (currentDate > new Date(due_date.trim())) {
        res.status(400);
        throw new Error("Due date can't be in the past");
      }

      if (difficulty < 1 || difficulty > 5) {
        res.status(400);
        throw new Error("Put a valid difficulty");
      }

      const challenge = await TeamChallenge.create({
        challenge_name: challenge_name.trim(),
        owner_id: req.user.id,
        team_id,
        due_date: new Date(due_date),
        difficulty,
        description: description.trim(),
        resources,
        image_url: image_url.trim(),
        reward,
        valid: true,
      });
      res.status(201).json({ message: "success", data: challenge });
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

//@desc Get Challenges
//@route GET /api/teams/challenge
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
