import { Schema, model } from "mongoose";

interface IChat {
  members: any;
}

const chatSchema = new Schema<IChat>(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
