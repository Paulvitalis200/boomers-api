import mongoose, { Schema, model } from "mongoose";

interface ITeam {
  owner_id: any;
  name: string;
  category: any;
  isActive: boolean;
  audience: any;
  teamUsername: string;
  displayImage: string;
  backgroundImage: string;
}

const teamSchema = new Schema<ITeam>(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: false,
    },
    category: {
      type: Array,
      required: true,
    },
    isActive: {
      type: Boolean,
    },
    audience: {
      type: Array,
      required: true,
    },
    teamUsername: {
      type: String,
      required: true,
      unique: true,
    },
    displayImage: {
      type: String,
    },
    backgroundImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Team = model<ITeam>("Team", teamSchema);

export default Team;
