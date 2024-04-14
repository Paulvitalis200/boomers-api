import { Schema, model } from "mongoose";

interface ITeam {
  owner: any;
  name: string;
  category: any;
  isActive: boolean;
  audience: any;
  teamUsername: string;
}

const teamSchema = new Schema<ITeam>(
  {
    owner: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

const Team = model<ITeam>("Team", teamSchema);

export default Team;
