import express from "express";

import validateToken from "../middleware/validateTokenHandler";
import {
  createChat,
  findChat,
  findUserChats,
} from "../controllers/chatController";

const chatRouter = express.Router();
chatRouter.use(validateToken);

chatRouter.post("/", createChat);
chatRouter.get("/:userId", findUserChats);
chatRouter.get("/find/:firstId/:secondId", findChat);

export default chatRouter;
