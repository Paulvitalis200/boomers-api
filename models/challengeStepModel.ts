import { Schema, model } from "mongoose";

// Id
// User id
// Solution_id
// Steps: [{
// id: ‘1’,
// Description: ‘fhdskjhfdskj’,
// Completed: boolean
// SubSteps: [
// Id: Test,
// Description: Test
// Completed: boolean
// ]
// }]
// percentageCompleted

interface IChallengeStep {
  user_id: Schema.Types.ObjectId;
  solution_id: Schema.Types.ObjectId;
  challenge_id: Schema.Types.ObjectId;
  description: string;
  completed: boolean;
  percentageCompleted: Number;
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
    percentageCompleted: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
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
