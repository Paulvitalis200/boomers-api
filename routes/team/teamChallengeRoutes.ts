import express from "express";

import validateToken from "../../middleware/validateTokenHandler";

import {
  createTeamChallenge,
  getAllTeamChallenges,
  getIndividualTeamChallenge,
  updateIndividualTeamChallenge,
} from "../../controllers/team/teamChallengeController";

const teamChallengeRouter = express.Router();

teamChallengeRouter.use(validateToken);

/**
 * @openapi
 * '/api/team/:id/challenges':
 *  get:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Get Team Challenges
 *     responses:
 *      200:
 *        description: success
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
teamChallengeRouter.get("/:id/challenges", getAllTeamChallenges);

/**
 * @openapi
 * '/api/team/:id/challenges':
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
 *              - due_date
 *              - difficulty
 *              - description
 *              - resources
 *              - image_url
 *              - reward
 *            properties:
 *              email:
 *                type: string
 *                default: janedoe@gmail.com
 *              team_id:
 *                type: string
 *              due_date:
 *                type: date
 *              difficulty:
 *                type: number
 *              description:
 *                type: string
 *              resources:
 *                type: array
 *              image_url:
 *                type: string
 *              reward:
 *                type: string
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
teamChallengeRouter.post("/:id/challenges", createTeamChallenge);

/**
 * @openapi
 * '/api/team/:teamId/challenges/:challengeId':
 *  get:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Get Individual Team Challenge
 *     responses:
 *      200:
 *        description: success
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
teamChallengeRouter.get(
  "/:teamId/challenges/:challengeId",
  getIndividualTeamChallenge
);

/**
 * @openapi
 * '/api/team/:id/challenges':
 *  put:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Update Team Challenge
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - challenge_name
 *              - team_id
 *              - due_date
 *              - difficulty
 *              - description
 *              - resources
 *              - image_url
 *              - reward
 *            properties:
 *              email:
 *                type: string
 *                default: janedoe@gmail.com
 *              team_id:
 *                type: string
 *              due_date:
 *                type: date
 *              difficulty:
 *                type: number
 *              description:
 *                type: string
 *              resources:
 *                type: array
 *              image_url:
 *                type: string
 *              reward:
 *                type: string
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
teamChallengeRouter.put(
  "/:teamId/challenges/:challengeId",
  updateIndividualTeamChallenge
);

export default teamChallengeRouter;
