import { Schema, model } from "mongoose";

interface IChallengeComment {
  challenge_id: Schema.Types.ObjectId;
  comment: string;
  user: any;
}

const challengeCommentSchema = new Schema<IChallengeComment>(
  {
    challenge_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TeamChallenge",
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: {},
    },
  },
  {
    timestamps: true,
  }
);

const ChallengeComment = model<IChallengeComment>(
  "ChallengeComment",
  challengeCommentSchema
);

export default ChallengeComment;
