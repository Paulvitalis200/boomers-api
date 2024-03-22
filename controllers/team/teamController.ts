import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Team from "../../models/teamModel";
import User from "../../models/userModel";

//@desc Create team
//@route POST /api/teams
//access private
export const createTeam = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, category, audience, teamUsername } = req.body;
    if (!name.trim() && !category) {
      res.status(400);
      throw new Error("Please put name and category");
    }

    const teamExists = await Team.findOne({ teamUsername });

    if (teamExists) {
      res.status(409);
      throw new Error("Team already exists");
    }

    const user = await User.findOne({ email: "vitalispaul48@live.com" });
    console.log("BODY: ", req.body);
    console.log("USER: ", user?._id);
    const team = await Team.create({
      name,
      category,
      audience,
      teamUsername,
      owner: user?._id,
    });

    res.status(201).json({ message: "successful", data: team });
  } catch (error: any) {
    throw new Error(error);
  }
});

//@desc Get teams
//@route GET /api/teams
//access private
export const getAllTeams = asyncHandler(async (req: Request, res: Response) => {
  try {
    const teams = await Team.find({});

    res.status(200).json({ message: "successful", data: teams });
  } catch (error: any) {
    throw new Error(error);
  }
});
