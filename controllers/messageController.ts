import asyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/validateTokenHandler";
import { Response } from "express";
import Message from "../models/messageModel";

// createMessage
// getMessages

export const createMessage = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { chatId, senderId, text } = req.body;
    try {
      const response = await Message.create({
        chatId,
        senderId,
        text,
      });
      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

export const getMessages = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { chatId } = req.params;
    try {
      const messages = await Message.find({
        chatId,
      });
      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);
