import express from "express";
import registerUser, {
  resendVerificationCode,
  verifyUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify", verifyUser);
userRouter.post("/resend-code", resendVerificationCode);

export default userRouter;
