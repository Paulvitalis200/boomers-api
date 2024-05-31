import asyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/validateTokenHandler";
import { Response } from "express";
import Chat from "../models/chatModel";

// createchat
// findUserChats
// findChat

export const createChat = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { firstId, secondId } = req.body;

    try {
      const chat = await Chat.findOne({
        members: { $all: [firstId, secondId] },
      });

      if (chat) {
        res.status(409).json({ message: "Chat already exists", data: chat });
        return;
      }

      const newChat = new Chat({
        members: [firstId, secondId],
      });

      const response = await newChat.save();

      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

export const findUserChats = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.params.userId;

    try {
      const chats = await Chat.find({
        members: { $in: [userId] },
      });

      res.status(200).json(chats);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

export const findChat = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { firstId, secondId } = req.params;

    try {
      const chat = await Chat.findOne({
        members: { $all: [firstId, secondId] },
      });

      res.status(200).json(chat);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);
