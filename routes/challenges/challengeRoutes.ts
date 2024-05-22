import express from "express";
import {
  getAllChallenges,
  getChallenge,
} from "../../controllers/challengesController";
import validateToken from "../../middleware/validateTokenHandler";
import {
  getAllChallengeSolutions,
  getChallengeSolution,
  postSolution,
  updateSolution,
} from "../../controllers/challengeSolutionController";
import {
  addChallengeStep,
  deleteChallengeStep,
  getAllChallengeSteps,
  getChallengeStep,
  updateChallengeStep,
} from "../../controllers/challengeStepsController";
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
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */
challengeRouter.post("/:id/solutions", postSolution);

/**
 * @openapi
 * '/api/challenges/:id/solutions':
 *  post:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Get all challenge solutions
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.get("/:id/solutions", getAllChallengeSolutions);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId':
 *  post:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Get challenge solution
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.get("/:id/solutions/:solutionId", getChallengeSolution);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId':
 *  post:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Patch challenge solution
 *     responses:
 *      200:
 *        description: Success
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.patch("/:id/solutions/:solutionId", updateSolution);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/steps':
 *  post:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Add step to solution
 *     responses:
 *      201:
 *        description: Created
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.post("/:id/solutions/:solutionId/steps", addChallengeStep);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/steps':
 *  get:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Get solution steps
 *     responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.get("/:id/solutions/:solutionId/steps", getAllChallengeSteps);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/steps/stepId':
 *  gett:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Get solution steps
 *     responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.get(
  "/:id/solutions/:solutionId/steps/:stepId",
  getChallengeStep
);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/steps/:stepId':
 *  post:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Update solution steps
 *     responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.put(
  "/:id/solutions/:solutionId/steps/:stepId",
  updateChallengeStep
);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/steps/:stepId':
 *  delete:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Delete solution step
 *     responses:
 *      204:
 *        description: Deleted
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.delete(
  "/:id/solutions/:solutionId/steps/:stepId",
  deleteChallengeStep
);

export default challengeRouter;
