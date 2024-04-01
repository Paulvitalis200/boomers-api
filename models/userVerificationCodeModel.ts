import { Schema, model } from 'mongoose';

interface IUserVerificationCode {
  userId: string;
  email?: string;
  code: string;
  signinCode: string;
}

const userVerificationCodeSchema = new Schema<IUserVerificationCode>(
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

const UserVerificationCode = model<IUserVerificationCode>(
  'UserVerificationCode',
  userVerificationCodeSchema
);

export default UserVerificationCode;
