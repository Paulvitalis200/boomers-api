import express from "express";
import registerUser, {
  currentUser,
  getUser,
  getUsers,
  resendVerificationCode,
  verifyUser,
} from "../controllers/userController";
import logInUser, { verifyUserCode } from "../controllers/authController";
import validateToken from "../middleware/validateTokenHandler";

const userRouter = express.Router();

/**
 * @openapi
 * '/api/users/register':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@232
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
userRouter.post("/register", registerUser);

/**
 * @openapi
 * '/api/users/login':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@232
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
userRouter.post("/login", logInUser);

/**
 * @openapi
 * '/api/users/verify-login':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Verify user Authentication code
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - authCode
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              authCode:
 *                type: string
 *                default: 433443
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
userRouter.post("/verify-login", verifyUserCode);

/**
 * @openapi
 * '/api/users/verify':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Verify a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - verificationCode
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              verificationCode:
 *                type: string
 *                default: 433443
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
userRouter.post("/verify", verifyUser);

/**
 * @openapi
 * '/api/users/resend-verification':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Resend verification code to user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *     responses:
 *      201:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
userRouter.post("/resend-verification", resendVerificationCode);

/**
 * @openapi
 * '/api/users':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Returns list of users
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
userRouter.get("/", getUsers);

/**
 * @openapi
 * '/api/users/:id':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Returns one user
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
userRouter.get("/:id", getUser);

/**
 * @openapi
 * '/api/users/current':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Returns current user
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad Request
 *      401:
 *        description: User is not Authorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
userRouter.get("/current", currentUser, validateToken);

export default userRouter;
