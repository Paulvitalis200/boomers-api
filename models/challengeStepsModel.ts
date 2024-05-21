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

interface IChallengeSteps {
  user_id: Schema.Types.ObjectId;
  solution_id: Schema.Types.ObjectId;
  steps: any;
  completed: boolean;
  subSteps: any;
  percentageCompleted: Number;
  comments: any;
}

const challengeStepsSchema = new Schema<IChallengeSteps>(
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

    steps: {
      type: [],
      default: null,
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
  },
  {
    timestamps: true,
  }
);

const ChallengeSteps = model<IChallengeSteps>(
  "ChallengeSteps",
  challengeStepsSchema
);

export default ChallengeSteps;
