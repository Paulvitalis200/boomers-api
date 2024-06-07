import express from "express";
import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeam,
  updateTeam,
} from "../../controllers/team/teamController";
import validateToken from "../../middleware/validateTokenHandler";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

// This will enable just storing the image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const teamRouter = express.Router();

teamRouter.use(validateToken);

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
teamRouter.post("/", upload.single("image"), createTeam);

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

/**
 * @openapi
 * '/api/teams/:id':
 *  put:
 *     tags:
 *     - Team Controller
 *     summary: Update a team
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
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
teamRouter.put("/:id", updateTeam, upload.single("image"));

/**
 * @openapi
 * '/api/teams/:id':
 *  delete:
 *     tags:
 *     - Team Controller
 *     summary: Delete a team
 *     responses:
 *      200:
 *        description: Ok
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
teamRouter.delete("/:id", deleteTeam);

/**
 * @openapi
 * '/api/teams/:id':
 *  get:
 *     tags:
 *     - Team Controller
 *     summary: Get a team
 *     responses:
 *      200:
 *        description: Ok
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
teamRouter.get("/:id", getTeam);

export default teamRouter;
