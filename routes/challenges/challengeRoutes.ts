import express from "express";
import {
  getAllChallenges,
  getChallenge,
} from "../../controllers/challengesController";
import validateToken from "../../middleware/validateTokenHandler";
import { postSolution } from "../../controllers/challengeSolutionController";
const challengeRouter = express.Router();

challengeRouter.use(validateToken);

/**
 * @openapi
 * '/api/challenges':
 *  get:
 *     tags:
 *     - Challenges Controller
 *     summary: Returns list of challenges
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.get("/", getAllChallenges);

/**
 * @openapi
 * '/api/challenges/:id':
 *  get:
 *     tags:
 *     - Challenges Controller
 *     summary: Returns individual challenge
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.get("/:id", getChallenge);

/**
 * @openapi
 * '/api/challenges/:id/solutions':
 *  post:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Creates challenge solution
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.post("/:id/solutions", postSolution);

export default challengeRouter;
