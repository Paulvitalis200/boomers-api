import express from "express";
import {
  getProfile,
  updateUserProfile,
} from "../controllers/userProfileController";
import validateToken from "../middleware/validateTokenHandler";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import dotenv from "dotenv";

dotenv.config();

// This will enable just storing the image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// This has to match the form value name on our frontend app
// upload.single("image");
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
userProfileRouter.put(
  "/:id/profile",
  upload.single("image"),
  updateUserProfile
);

export default userProfileRouter;
