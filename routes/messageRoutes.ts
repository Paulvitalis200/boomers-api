import express from "express";

import validateToken from "../middleware/validateTokenHandler";
import { createMessage, getMessages } from "../controllers/messageController";

const messageRouter = express.Router();
messageRouter.use(validateToken);

messageRouter.post("/", createMessage);
messageRouter.get("/:chatId", getMessages);

export default messageRouter;
