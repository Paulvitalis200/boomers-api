import asyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/validateTokenHandler";
import { Response } from "express";
import ChallengeSolution from "../models/challengeSolutionModel";
import TeamChallenge from "../models/teamChallengeModel";
import Team from "../models/teamModel";
import TeamMember from "../models/teamMemberModel";
import ChallengeStep from "../models/challengeStepModel";
import UserProfile from "../models/userProfileModel";
import SolutionComment from "../models/solutionCommentModel";
import SolutionRating from "../models/solutionRatingModel";

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
        res.status(403).json({ message: "User does not belong to the team" });
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

//@desc Post Solution comment
//@route POST /api/challenges/:id/solutions/:solutionId/comments
//access private
export const postSolutionComment = asyncHandler(
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
        res.status(403).json({ message: "User does not belong to the team" });
      } else {
        const { comment } = req.body;

        if (!comment.trim()) {
          res.status(400).json({ message: "Put a comment will ya" });
          return;
        }

        const user = await UserProfile.find({ user_id: req.user.id });

        const solutionComment = await SolutionComment.create({
          solution_id: req.params.solutionId,
          comment,
          user: user[0],
        });

        res.status(201).json({ message: "successful", data: solutionComment });
      }
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);

//@desc Update Solution comment
//@route PUT /api/challenges/:id/solutions/:solutionId/comments/:commentId
//access private
export const updateSolutionComment = asyncHandler(
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
        res.status(403).json({ message: "User does not belong to the team" });
      } else {
        const { comment } = req.body;

        if (!comment.trim()) {
          res.status(400).json({ message: "Put a comment will ya" });
          return;
        }

        const solutionComment = await SolutionComment.find({
          _id: req.params.commentId,
        });

        if (solutionComment[0]?.user.user_id.toString() !== req.user.id) {
          res.status(403).json({ error: "This is not your comment" });
          return;
        }

        const updatedComment = await SolutionComment.findByIdAndUpdate(
          req.params.commentId,
          {
            comment: comment,
          },
          { new: true }
        );

        res.status(200).json({ message: "successful", data: updatedComment });
      }
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);

//@desc Get Solution comments
//@route GET /api/challenges/:id/solutions/:solutionId/comments
//access private
export const getSolutionComments = asyncHandler(
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

      const solutionComments = await SolutionComment.find({});

      res.status(200).json({ message: "successful", data: solutionComments });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);

//@desc Get Solution comment
//@route GET /api/challenges/:id/solutions/:solutionId/comments/:commentId
//access private
export const getSolutionComment = asyncHandler(
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

      const solutionComment = await SolutionComment.findOne({
        _id: req.params.commentId,
      });

      res.status(200).json({ message: "successful", data: solutionComment });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);

//@desc Delete Solution comment
//@route DELETE /api/challenges/:id/solutions/:solutionId/comments/:commentId
//access private
export const deleteSolutionComment = asyncHandler(
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

      const solutionComment = await SolutionComment.findOne({
        _id: req.params.commentId,
      });

      if (!solutionComment) {
        res.status(404).json({ message: "Comment does not exist" });
        return;
      }

      if (solutionComment.user.user_id.toString() !== req.user.id) {
        res.status(403).json({ error: "This is not your comment" });
        return;
      }

      await SolutionComment.findByIdAndDelete(req.params.commentId);

      res.status(204).json({ message: "successful" });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);

//@desc Post Solution rating
//@route POST /api/challenges/:id/solutions/:solutionId/rating
//access private
export const postSolutionRating = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const { rating, feedback } = req.body;

      const challenge_id = req.params.id;
      const challenge: any = await TeamChallenge.findOne({
        _id: challenge_id,
      });
      const solution = await ChallengeSolution.findById({
        _id: req.params.solutionId,
      });

      if (!challenge) {
        res.status(404).json({ message: "Challenge does not exist" });
        return;
      }

      if (!solution) {
        res.status(404).json({ message: "Solution does not exist" });
        return;
      }

      const teamMembers = await TeamMember.find({
        team_id: challenge.team_id,
      });

      const belongsToTeam = teamMembers.find(
        (user) => user.user_id.toString() === req.user.id
      );

      if (challenge.owner_id.toString() !== req.user.id && !belongsToTeam) {
        res.status(403).json({ message: "User does not belong to the team" });
        return;
      }

      if (!rating) {
        res.status(400).json({ message: "No rating" });
        return;
      }

      const ratingExists = await SolutionRating.find({
        user_id: req.user.id,
      });

      if (ratingExists.length) {
        res.status(409).json({ message: "Rating already exists" });
        return;
      }

      const response = await SolutionRating.create({
        challenge_id: challenge._id,
        solution_id: req.params.solutionId,
        rating: rating,
        feedback: feedback ? feedback.trim() : null,
        user_id: req.user.id,
      });

      if (challenge.owner_id.toString() === req.user.id) {
        await ChallengeSolution.findByIdAndUpdate(
          req.params.solutionId,
          {
            owner_rating: response.rating,
          },
          {
            new: true,
          }
        );
      } else {
        let solutionRatings = await SolutionRating.find({
          solution_id: req.params.solutionId,
        });

        const averageRating =
          solutionRatings.reduce((total, next) => total + next.rating, 0) /
          solutionRatings.length;

        await ChallengeSolution.findByIdAndUpdate(
          req.params.solutionId,
          {
            overall_rating: averageRating,
          },
          {
            new: true,
          }
        );
      }
      res.status(201).json({ message: "successful", data: response });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

//@desc Get Solution ratings
//@route GET /api/challenges/:id/solutions/:solutionId/rating
//access private
export const getSolutionRatings = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const challenge_id = req.params.id;
      const challenge: any = await TeamChallenge.findOne({
        _id: challenge_id,
      });
      const solution = await ChallengeSolution.findById({
        _id: req.params.solutionId,
      });

      if (!challenge) {
        res.status(404).json({ message: "Challenge does not exist" });
        return;
      }

      if (!solution) {
        res.status(404).json({ message: "Solution does not exist" });
        return;
      }

      const response = await SolutionRating.find({
        solution_id: req.params.solutionId,
      });

      res.status(200).json({ message: "successful", data: response });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);

//@desc Update Solution rating
//@route GET /api/challenges/:id/solutions/:solutionId/rating/:ratingId
//access private
export const updateSolutionRating = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const { rating, feedback } = req.body;
      const challenge_id = req.params.id;
      const challenge: any = await TeamChallenge.findOne({
        _id: challenge_id,
      });
      const solution = await ChallengeSolution.findById({
        _id: req.params.solutionId,
      });

      if (!challenge) {
        res.status(404).json({ message: "Challenge does not exist" });
        return;
      }

      if (!solution) {
        res.status(404).json({ message: "Solution does not exist" });
        return;
      }

      const userRating = await SolutionRating.findById(req.params.ratingId);

      if (!userRating) {
        res.status(404).json({ message: "Rating does not exist" });
        return;
      }
      if (req.user.id !== userRating?.user_id.toString()) {
        res
          .status(403)
          .json({ message: "Cannot update since this is not your rating." });
        return;
      }
      const response = await SolutionRating.findByIdAndUpdate(
        req.params.ratingId,
        {
          rating: rating,
          feedback: feedback ? feedback.trim() : null,
        },
        { new: true }
      );

      if (challenge.owner_id.toString() === req.user.id) {
        await ChallengeSolution.findByIdAndUpdate(
          req.params.solutionId,
          {
            owner_rating: rating,
          },
          {
            new: true,
          }
        );
      } else {
        let solutionRatings = await SolutionRating.find({
          solution_id: req.params.solutionId,
        });

        const averageRating =
          solutionRatings.reduce((total, next) => total + next.rating, 0) /
          solutionRatings.length;

        await ChallengeSolution.findByIdAndUpdate(
          req.params.solutionId,
          {
            overall_rating: averageRating,
          },
          {
            new: true,
          }
        );
      }

      res.status(200).json({ message: "successful", data: response });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);
