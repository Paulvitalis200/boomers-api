import asyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/validateTokenHandler";
import { Response } from "express";
import ChallengeSolution from "../models/challengeSolutionModel";
import ChallengeStep from "../models/challengeStepModel";

//@desc POST Step
//@route POST /api/challenges/:id/solutions/:solutionId/steps
//access private
export const addChallengeStep = asyncHandler(
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

          const completedSteps: any = [];
          initialSteps.map((step: any) => {
            if (step.completed) completedSteps.push(step);
          });

          const percentageCompleted = Math.round(
            (completedSteps.length / initialSteps.length) * 100
          );

          await ChallengeSolution.findByIdAndUpdate(
            solutionId,
            {
              steps: initialSteps,
              percentageCompleted: percentageCompleted,
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
export const getAllChallengeSteps = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const solutionId = req.params.solutionId;

      const steps = await ChallengeStep.find({ solution_id: solutionId });

      res.status(200).json({ message: "successful", data: steps });
    } catch (error: any) {
      console.log("ERRROR: ", error);
    }
  }
);

//@desc Update Step
//@route Update /api/challenges/:id/solutions/:solutionId/steps/:stepId
//access private
export const updateChallengeStep = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const solutionId = req.params.solutionId;
      const solution = await ChallengeSolution.findById({ _id: solutionId });

      if (req.user.id !== solution?.user_id.toString()) {
        res.status(403).json({ error: "Solution does not belong to you" });
      } else {
        const { description, completed } = req.body;

        if (!description.trim()) {
          res.status(400).json({ error: "Please put a valid description" });
        } else {
          let challengeSolution: any = await ChallengeSolution.findById({
            _id: solutionId,
          });

          const updatedChallengeStep: any =
            await ChallengeStep.findByIdAndUpdate(
              req.params.stepId,
              {
                description: description,
                completed: completed ? completed : false,
              },
              { new: true }
            );
          if (updatedChallengeStep) {
            const updatedChallengeSolutionSteps = challengeSolution?.steps.map(
              (step: any) => {
                if (
                  step._id.toString() === updatedChallengeStep._id.toString()
                ) {
                  step.description = description;
                  step.completed = completed ? completed : false;
                }
                return step;
              }
            );

            challengeSolution.steps = updatedChallengeSolutionSteps;
            const initialSteps = challengeSolution?.steps;

            const completedSteps: any = [];
            initialSteps.map((step: any) => {
              if (step.completed) completedSteps.push(step);
            });

            const percentageCompleted = Math.round(
              (completedSteps.length / initialSteps.length) * 100
            );

            await ChallengeSolution.findByIdAndUpdate(
              solutionId,
              {
                steps: initialSteps,
                percentageCompleted: percentageCompleted,
              },
              { new: true }
            );

            res
              .status(200)
              .json({ message: "successful", data: updatedChallengeStep });
          }
        }
      }
    } catch (error: any) {
      console.log("ERRROR: ", error);
    }
  }
);

//@desc GET Step
//@route GET /api/challenges/:id/solutions/:solutionId/steps/:stepId
//access private
export const getChallengeStep = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const stepId = req.params.stepId;

      const step = await ChallengeStep.findById({ _id: stepId });

      res.status(200).json({ message: "successful", data: step });
    } catch (error: any) {
      console.log("ERRROR: ", error);
    }
  }
);
