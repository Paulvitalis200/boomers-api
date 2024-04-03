import { Schema, model } from "mongoose";

interface IUserCode {
  userId: string;
  email?: string;
  code: string;
  signinCode: string;
}

const userLoginCodeSchema = new Schema<IUserCode>(
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
    signinCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserLoginCode = model<IUserCode>("UserLoginCode", userLoginCodeSchema);

export default UserLoginCode;
