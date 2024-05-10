import e, { Request, Response } from "express";
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
        due_date,
        difficulty,
        description,
        resources,
        image_url,
        reward,
      } = req.body;

      const teamExists = await Team.findById({ _id: req.params.id });

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
        team_id: req.params.id,
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
//@route GET /api/teams/:id/challenges
//access private
export const getAllTeamChallenges = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const team = await Team.findById({ _id: req.params.id });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
      } else {
        const challenges = await TeamChallenge.find({
          team_id: req.params.id,
        });

        if (!challenges.length) {
          res.status(404).json({ message: "No challenges for team" });
        } else {
          res.status(200).json({ message: "successful", data: challenges });
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  }
);

//@desc Get Individual Team Challenge
//@route GET /api/teams/:id/challenges/:challengeId
//access private
export const getIndividualTeamChallenge = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      console.log("RPA: ", req.params.teamId);
      console.log("CHALLENGE: ", req.params.challengeId);
      const team = await Team.findById({ _id: req.params.teamId });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
      } else {
        const challenge = await TeamChallenge.findById({
          _id: req.params.challengeId,
        });

        if (!challenge) {
          res.status(404).json({ message: "Challenge not found" });
        } else {
          res.status(200).json({ message: "successful", data: challenge });
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  }
);

//@desc Update Individual Team Challenge
//@route PUT /api/teams/:id/challenges/:challengeId
//access private
export const updateIndividualTeamChallenge = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const team = await Team.findById({ _id: req.params.teamId });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
      } else {
        if (req.user.id !== team.owner_id.toString()) {
          res.status(403).json({ message: "User does not own the team" });
        } else {
          const challenge = await TeamChallenge.findById({
            _id: req.params.challengeId,
          });
          if (!challenge) {
            res.status(404).json({ message: "Challenge not found" });
          } else {
            const updatedChallenge = await TeamChallenge.findByIdAndUpdate(
              req.params.challengeId,
              req.body,
              {
                new: true,
              }
            );

            res
              .status(200)
              .json({ message: "Update successful", data: updatedChallenge });
          }
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  }
);

//@desc Delete Individual Team Challenge
//@route DELETE /api/teams/:id/challenges/:challengeId
//access private
export const deleteIndividualTeamChallenge = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const team = await Team.findById({ _id: req.params.teamId });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
      } else {
        if (req.user.id !== team.owner_id.toString()) {
          res.status(403).json({ message: "User does not own the team" });
        } else {
          const challenge = await TeamChallenge.findById({
            _id: req.params.challengeId,
          });
          if (!challenge) {
            res.status(404).json({ message: "Challenge not found" });
          } else {
            // Delete the authentication code from the database
            const challenge = await TeamChallenge.deleteOne({
              _id: req.params.challengeId,
            });
            res
              .status(204)
              .json({
                message: "Challenge deleted successfully",
                data: challenge,
              });
          }
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  }
);
