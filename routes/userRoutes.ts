import express from "express";
import registerUser, { verifyUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify", verifyUser);

export default userRouter;
