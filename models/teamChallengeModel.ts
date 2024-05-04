import mongoose, { Schema, model } from "mongoose";

/**
 * 
 * Team
Owner_id
Challenge name
Due date
Difficulty
Description 
    Description
    Resources
Rating
Comments
Best answer
    User
    Project link
Completion
Reward
Image

 */
interface ITeamChallenge {
  owner_id: any;
  team_id: any;
  name: string;
  due_date: Date;
  difficulty: number;
  description: string;
  resources: string;
  rating: number;
  comments: any;
  best_answer: any;
  completion: string;
  reward: string;
  image_url: string;
}

const teamChallengeSchema = new Schema<ITeamChallenge>(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    resources: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    comments: {
      type: [],
    },
    best_answer: {
      user: {
        type: String,
      },
      project_link: {
        type: String,
      },
    },
    completion: {
      type: String,
    },
    reward: {
      reward_type: {
        type: String,
      },
      reward_value: {
        type: String,
      },
    },
    image_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TeamChallenge = model<ITeamChallenge>(
  "TeamChallenge",
  teamChallengeSchema
);

export default TeamChallenge;
