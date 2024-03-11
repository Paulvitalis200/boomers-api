import { Schema, model } from "mongoose";

interface IUser {
  email?: string;
  phoneNumber?: string;
  password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
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
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
