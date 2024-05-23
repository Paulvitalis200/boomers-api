import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Team from "../../models/teamModel";
import { CustomRequest } from "../../middleware/validateTokenHandler";
import TeamMember from "../../models/teamMemberModel";

//@desc Create team
//@route POST /api/teams
//access private
export const createTeam = asyncHandler(
  async (req: CustomRequest, res: Response) => {
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

      const team = await Team.create({
        name,
        category,
        audience,
        teamUsername,
        owner_id: req.user.id,
      });

      await TeamMember.create({
        owner_id: req.user.id,
        team_id: team._id,
        user_id: req.user.id,
      });
      res.status(201).json({ message: "successful", data: team });
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

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

//@desc Get Team
//@route GET /api/teams/:id
//access public
export const getTeam = asyncHandler(async (req: Request, res: Response) => {
  try {
    const team = await Team.findOne({ _id: req.params.id });

    if (!team) {
      res.status(404).json({ message: "Team does not exist" });
      return;
    }
    res.status(200).json(team);
  } catch (error: any) {
    throw new Error(error);
  }
});

//@desc Update team
//@route PUT /api/teams/:id
//access private
export const updateTeam = asyncHandler(async (req: Request, res: Response) => {
  try {
    const team = await Team.findOne({ _id: req.params.id });
    if (!team) {
      res.status(404);
      throw new Error("Team not found");
    }

    const { name, category, audience, teamUsername } = req.body;
    let updateTeamBody = {
      name: team.name,
      category: team.category,
      audience: team.audience,
      teamUsername: team.teamUsername,
    };

    if (name && name.trim().length > 0) updateTeamBody.name = name.trim();

    if (category && category.length > 0) updateTeamBody.category = category;

    if (audience && audience.length > 0) updateTeamBody.audience = audience;

    if (teamUsername && teamUsername.trim().length > 0)
      updateTeamBody.teamUsername = teamUsername.trim();

    if (!name && !category && !audience && !teamUsername) {
      res.status(400);
      throw new Error("Please put a valid value");
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      team._id,
      {
        name: updateTeamBody.name,
        category: updateTeamBody.category,
        audience: updateTeamBody.audience,
        teamUsername: updateTeamBody.teamUsername,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedTeam);
  } catch (error: any) {
    throw new Error(error);
  }
});

//@desc Delete team
//@route DELETE /api/teams/:id
//access private
export const deleteTeam = asyncHandler(async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404);
      throw new Error("Team not found");
    }
    //   if(contact.user_id.toString() !== req.user.id) {
    //     res.status(403)
    //     throw new Error("User doesn't have permission to update other user contacts")
    // }

    // await Contact.remove()
    await Team.deleteOne({ _id: req.params.id });
    res.status(200).json(team);
  } catch (error) {}
});
