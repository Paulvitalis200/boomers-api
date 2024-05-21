import { Schema, model } from "mongoose";

// id
// Challenge id
// User id
// Status: IN PROGRESS, COMPLETED, UNSTARTED
// updatedAt
// createdAt
// Steps: Either include array of steps here or reference steps table
// valid
// Feedback
// percentageCompleted
// completedDate
// Rating
// Out of 10
// Feedback

interface IChallengeSolution {
  challenge_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  status: Number;
  steps: any;
  valid: boolean;
  comments: any;
  percentageCompleted: Number;
  completedDate: Date;
  rating: any;
}

const challengeSolutionSchema = new Schema<IChallengeSolution>(
  {
    challenge_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TeamChallenge",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: Number,
      required: true,
      default: 0,
    },
    steps: {
      type: [],
      default: null,
    },
    valid: {
      type: Boolean,
      default: false,
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
    completedDate: {
      type: Date,
      default: null,
    },
    rating: {
      type: {},
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ChallengeSolution = model<IChallengeSolution>(
  "ChallengeSolution",
  challengeSolutionSchema
);

export default ChallengeSolution;
