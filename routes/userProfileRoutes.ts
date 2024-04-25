import express from "express";
import {
  getProfile,
  updateUserProfile,
} from "../controllers/userProfileController";
import validateToken from "../middleware/validateTokenHandler";

const userProfileRouter = express.Router();

userProfileRouter.use(validateToken);
/**
 * @openapi
 * '/api/users/:id/profile':
 *  get:
 *     tags:
 *     - User Profile Controller
 *     summary: Returns a user's profile
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
userProfileRouter.get("/:id/profile", getProfile);

/**
 * @openapi
 * '/api/users/:id/profile':
 *  put:
 *     tags:
 *     - User Profile Controller
 *     summary: Updates a user's profile
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
userProfileRouter.put("/:id/profile", updateUserProfile);

export default userProfileRouter;
