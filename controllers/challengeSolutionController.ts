import asyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/validateTokenHandler";
import { Response } from "express";
import ChallengeSolution from "../models/challengeSolutionModel";
import TeamChallenge from "../models/teamChallengeModel";
import Team from "../models/teamModel";
import TeamMember from "../models/teamMemberModel";

//@desc Post Solution
//@route POST /api/challenges/:id/solutions
//access private
export const postSolution = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const challenge_id = req.params.id;
      const challengeExists: any = await TeamChallenge.find({
        _id: challenge_id,
      });

      if (!challengeExists.length) {
        res.status(404).json({ message: "Challenge does not exist" });
        return;
      }

      const teamMembers = await TeamMember.find({
        team_id: challengeExists[0].team_id,
      });

      if (!teamMembers) {
        res.status(404);
        throw new Error("No team members");
      }

      const teamMemberExists: any = teamMembers.find((member) => {
        return member.user_id.toString() === req.user.id;
      });

      if (!teamMemberExists) {
        res.status(401).json({ message: "User does not belong to the team" });
      } else {
        const solutionExists = await ChallengeSolution.find({
          challenge_id: challenge_id,
        });

        const userSolution = solutionExists.find((solution) => {
          return solution.user_id.toString() === req.user.id;
        });

        if (!userSolution) {
          const challengeSolution = await ChallengeSolution.create({
            challenge_id: challenge_id,
            user_id: req.user.id,
          });

          res
            .status(201)
            .json({ message: "successful", data: challengeSolution });
        } else {
          res
            .status(409)
            .json({ error: "User has already began taking the quiz." });
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  }
);

//@desc PATCH Solution
//@route PATCH /api/challenges/:id/solutions/:solutionId
//access private
export const updateSolution = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const solutionId = req.params.solutionId;
      const solution = await ChallengeSolution.findById({ _id: solutionId });

      if (req.user.id !== solution?.user_id.toString()) {
        res.status(403).json({ error: "Solution does not belong to you" });
      } else {
        res.status(200).json({ message: "successful", data: solution });
      }
    } catch (error: any) {
      console.log("ERRROR: ", error);
    }
  }
);

//@desc Get Solution
//@route GET /api/challenges/:id/solutions/:solutionId
//access private
export const getChallengeSolution = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const solutionId = req.params.solutionId;

      const solution = await ChallengeSolution.findById({ _id: solutionId });

      res.status(200).json({ message: "successful", data: solution });
    } catch (error: any) {
      console.log("ERRROR: ", error);
    }
  }
);
