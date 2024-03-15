import { Schema, model } from "mongoose";

interface IUserCode {
  userId: string;
  email?: string;
  code: string;
}

const userCodeSchema = new Schema<IUserCode>(
  {
    userId: {
      type: String,
    },
    email: {
      type: String,
    },
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserCode = model<IUserCode>("UserCode", userCodeSchema);

export default UserCode;
