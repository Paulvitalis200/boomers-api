import asyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/validateTokenHandler";
import { Response } from "express";
import ChallengeSolution from "../models/challengeSolutionModel";
import ChallengeStep from "../models/challengeStepModel";

//@desc POST Step
//@route POST /api/challenges/:id/solutions/:solutionId/steps
//access private
export const addStep = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const solutionId = req.params.solutionId;
      const solution = await ChallengeSolution.findById({ _id: solutionId });

      if (req.user.id !== solution?.user_id.toString()) {
        res.status(403).json({ error: "Solution does not belong to you" });
      } else {
        const { description } = req.body;

        if (!description.trim()) {
          res.status(400).json({ error: "Please put a valid description" });
          //   throw new Error("Please put a valid description");
        } else {
          const challengeStep = await ChallengeStep.create({
            solution_id: solutionId,
            user_id: req.user.id,
            description: description,
            challenge_id: req.params.id,
          });

          const challengeSolution = await ChallengeSolution.findById({
            _id: solutionId,
          });

          const initialSteps = challengeSolution?.steps;

          initialSteps.push(challengeStep);

          await ChallengeSolution.findByIdAndUpdate(
            solutionId,
            {
              steps: initialSteps,
            },
            { new: true }
          );

          res.status(201).json({ message: "successful", data: challengeStep });
        }
      }
    } catch (error: any) {
      console.log("ERRROR: ", error);
    }
  }
);

//@desc GET Steps
//@route GET /api/challenges/:id/solutions/:solutionId/steps
//access private
export const getAllSteps = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const solutionId = req.params.solutionId;

      const steps = await ChallengeStep.find({ solution_id: solutionId });

      res.status(201).json({ message: "successful", data: steps });
    } catch (error: any) {
      console.log("ERRROR: ", error);
    }
  }
);
