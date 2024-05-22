import asyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/validateTokenHandler";
import { Response } from "express";
import ChallengeSolution from "../models/challengeSolutionModel";
import TeamChallenge from "../models/teamChallengeModel";
import Team from "../models/teamModel";
import TeamMember from "../models/teamMemberModel";
import ChallengeStep from "../models/challengeStepModel";

//@desc Post Solution
//@route POST /api/challenges/:id/solutions
//access private
export const postChallengeSolution = asyncHandler(
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
            status: 1,
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
export const updateChallengeSolution = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const solutionId = req.params.solutionId;
      const solution = await ChallengeSolution.findById({ _id: solutionId });

      const challenge = await TeamChallenge.findById({
        _id: req.params.id,
      });

      if (!solution || !challenge) {
        res.status(404).json({ error: "Solution does not exist" });
        return;
      }
      if (req.user.id !== solution?.user_id.toString()) {
        res.status(403).json({ error: "Solution does not belong to you" });
        return;
      } else {
        const { status, demo_url, solution } = req.body;
        let completedDate;

        if (status && status !== 1 && status !== 0 && status !== 2) {
          res.status(400).json({
            error: "Kindly put a valid value.",
          });
          return;
        }

        if (status && status === 2) {
          const challengeSolution = await ChallengeSolution.findById({
            _id: solutionId,
          });

          if (challengeSolution?.percentageCompleted !== 100) {
            res.status(400).json({
              error: "Kindly complete all the steps before submitting",
            });
            return;
          }
          completedDate = new Date();
        }

        const updatedSolution = await ChallengeSolution.findByIdAndUpdate(
          solutionId,
          {
            status: status,
            demo_url,
            solution,
            completedDate,
          },
          { new: true }
        );
        res.status(200).json({ message: "successful", data: updatedSolution });
      }
    } catch (error: any) {
      console.log("ERRROR: ", error);
      res.status(400).json({ error: error });
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

//@desc Delete Solutions
//@route GET /api/challenges/:id/solutions
//access private
export const getAllChallengeSolutions = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const challengeId = req.params.id;

      const solutions = await ChallengeSolution.find({
        challenge_id: challengeId,
      });

      res.status(200).json({ message: "successful", data: solutions });
    } catch (error: any) {
      console.log("ERRROR: ", error);
    }
  }
);

//@desc DELETE Solution
//@route DELETE /api/challenges/:id/solutions/:solutionId
//access private
export const deleteChallengeSolution = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const solution_id = req.params.solutionId;
      const solution = await ChallengeSolution.findById({ _id: solution_id });

      const challenge = await TeamChallenge.findById({
        _id: req.params.id,
      });

      if (!solution || !challenge) {
        res.status(404).json({ error: "Solution does not exist" });
        return;
      }
      if (req.user.id !== solution?.user_id.toString()) {
        res.status(403).json({ error: "Solution does not belong to you" });
        return;
      } else {
        await ChallengeSolution.findByIdAndDelete(solution_id);

        await ChallengeStep.deleteMany({ solution_id: { $in: solution_id } });

        res.status(204).json({ message: "successful" });
      }
    } catch (error: any) {
      console.log("ERRROR: ", error);
      res.status(400).json({ error: error });
    }
  }
);
