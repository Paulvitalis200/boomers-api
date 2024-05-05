import express from "express";

import validateToken from "../../middleware/validateTokenHandler";

import {
  createTeamChallenge,
  getAllChallenges,
} from "../../controllers/team/teamChallengeController";

const teamChallengeRouter = express.Router();

teamChallengeRouter.use(validateToken);

teamChallengeRouter.get("/challenge", getAllChallenges);
/**
 * @openapi
 * '/api/team/challenge':
 *  post:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Create Team Challenge
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - challenge_name
 *              - team_id
 *            properties:
 *              email:
 *                type: string
 *                default: janedoe@gmail.com
 *              team_id:
 *                type: string
 *                default: hnhre943u843493
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
teamChallengeRouter.post("/challenge", createTeamChallenge);

export default teamChallengeRouter;
