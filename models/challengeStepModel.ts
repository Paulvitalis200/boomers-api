import { Schema, model } from "mongoose";

interface IChallengeStep {
  user_id: Schema.Types.ObjectId;
  solution_id: Schema.Types.ObjectId;
  challenge_id: Schema.Types.ObjectId;
  description: string;
  completed: boolean;
  comments: any;
}

const challengeStepSchema = new Schema<IChallengeStep>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    solution_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ChallengeSolution",
    },
    challenge_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TeamChallenge",
    },
    comments: {
      type: [],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ChallengeStep = model<IChallengeStep>(
  "ChallengeStep",
  challengeStepSchema
);

export default ChallengeStep;
