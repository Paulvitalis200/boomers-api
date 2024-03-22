import express from "express";
import { createTeam, getAllTeams } from "../../controllers/team/teamController";

const teamRouter = express.Router();

/**
 * @openapi
 * '/api/teams':
 *  post:
 *     tags:
 *     - Team Controller
 *     summary: Create a team
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - audience
 *              - category
 *              - teamUserName
 *            properties:
 *              name:
 *                type: string
 *                default: thefunky Bunch
 *              audience:
 *                type: array
 *                default: ['Developers', 'Farmers']
 *              category:
 *                type: array
 *                default: ['Software']
 *              teamUserName:
 *                type: string
 *                default: thefunkyBunch
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
teamRouter.post("/", createTeam);

/**
 * @openapi
 * '/api/teams':
 *  post:
 *     tags:
 *     - Team Controller
 *     summary: Get all teams
 *     requestBody:
 *      required: false
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
teamRouter.get("/", getAllTeams);

export default teamRouter;
