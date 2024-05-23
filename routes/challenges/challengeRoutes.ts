import express from "express";
import {
  getAllChallenges,
  getChallenge,
} from "../../controllers/challengesController";
import validateToken from "../../middleware/validateTokenHandler";
import {
  deleteChallengeSolution,
  deleteSolutionComment,
  getAllChallengeSolutions,
  getChallengeSolution,
  getSolutionComment,
  getSolutionComments,
  postChallengeSolution,
  postSolutionComment,
  updateChallengeSolution,
  updateSolutionComment,
} from "../../controllers/challengeSolutionController";
import {
  addChallengeStep,
  deleteChallengeStep,
  getAllChallengeSteps,
  getChallengeStep,
  updateChallengeStep,
} from "../../controllers/challengeStepsController";
import {
  deleteChallengeComment,
  getChallengeComment,
  getChallengeComments,
  postChallengeComment,
  updateChallengeComment,
} from "../../controllers/team/teamChallengeController";
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
challengeRouter.post("/:id/solutions", postChallengeSolution);

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
challengeRouter.patch("/:id/solutions/:solutionId", updateChallengeSolution);

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
challengeRouter.patch(
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

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/':
 *  delete:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Delete solution
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
challengeRouter.delete("/:id/solutions/:solutionId", deleteChallengeSolution);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/comments':
 *  post:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Creates challenge solution comment
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
challengeRouter.post(
  "/:id/solutions/:solutionId/comments",
  postSolutionComment
);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/comments/:solutionId':
 *  put:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Update solution comment
 *     responses:
 *      200:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
challengeRouter.put(
  "/:id/solutions/:solutionId/comments/:commentId",
  updateSolutionComment
);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/comments':
 *  get:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Get solution comments
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
challengeRouter.get("/:id/solutions/:solutionId/comments", getSolutionComments);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/comments/:commentId':
 *  get:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Get solution comment
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
challengeRouter.get(
  "/:id/solutions/:solutionId/comments/:commentId",
  getSolutionComment
);

/**
 * @openapi
 * '/api/challenges/:id/solutions/:solutionId/comments/:commentId':
 *  get:
 *     tags:
 *     - Challenge Solution Controller
 *     summary: Delete solution comment
 *     responses:
 *      204:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
challengeRouter.delete(
  "/:id/solutions/:solutionId/comments/:commentId",
  deleteSolutionComment
);

/**
 * @openapi
 * '/api/challenges/:id/comments':
 *  post:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Add comment to challenge
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.post("/:id/comments", postChallengeComment);

/**
 * @openapi
 * '/api/challenges/:id/comments/:commentId':
 *  put:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Update challenge comment
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.put("/:id/comments/:commentId", updateChallengeComment);

/**
 * @openapi
 * '/api/challenges/:id/comments':
 *  get:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Get challenge comments
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.get("/:id/comments", getChallengeComments);

/**
 * @openapi
 * '/api/challenges/:id/comments/:commentId':
 *  get:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Get challenge comment
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.get("/:id/comments/:commentId", getChallengeComment);

/**
 * @openapi
 * '/api/challenges/:id/comments/:commentId':
 *  delete:
 *     tags:
 *     - Team Challenge Controller
 *     summary: Delete challenge comment
 *     responses:
 *      204:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
challengeRouter.delete("/:id/comments/:commentId", deleteChallengeComment);

export default challengeRouter;
