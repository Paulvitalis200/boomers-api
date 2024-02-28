import { Schema, model } from "mongoose";

interface IUser {
  email?: string;
  phoneNumber?: string;
  password: string;
  firstName: string;
  lastName: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: false,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
